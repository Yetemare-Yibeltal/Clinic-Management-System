// pagination.utils.js — Reusable pagination for all list endpoints
import mongoose from 'mongoose'

// ── Default pagination settings ────────────────────────
export const PAGINATION_DEFAULTS = {
  page:    1,
  limit:   10,
  maxLimit:100,
}

// ── Parse pagination params from request query ─────────
// Input:  req.query = { page: '2', limit: '20' }
// Output: { page: 2, limit: 20, skip: 20 }
export function parsePaginationParams(query) {
  let page  = parseInt(query.page)  || PAGINATION_DEFAULTS.page
  let limit = parseInt(query.limit) || PAGINATION_DEFAULTS.limit

  // Sanitize values
  if (page  < 1) page  = 1
  if (limit < 1) limit = 1
  if (limit > PAGINATION_DEFAULTS.maxLimit) limit = PAGINATION_DEFAULTS.maxLimit

  const skip = (page - 1) * limit

  return { page, limit, skip }
}

// ── Build pagination metadata for response ─────────────
export function buildPaginationMeta(total, page, limit) {
  const totalPages  = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  }
}

// ── Main paginate function ─────────────────────────────
// Runs a Mongoose query with pagination and returns
// both the data and pagination metadata in one call
//
// Usage:
//   const result = await paginate(User, filter, { page, limit }, options)
//   res.json({ data: result.data, pagination: result.pagination })
export async function paginate(Model, filter = {}, { page = 1, limit = 10 } = {}, options = {}) {
  const {
    sort       = { createdAt: -1 },
    populate   = [],
    select     = '',
  } = options

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    Model.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate)
      .select(select),
    Model.countDocuments(filter),
  ])

  return {
    data,
    pagination: buildPaginationMeta(total, page, limit),
  }
}

// ── Parse sort params from request query ───────────────
// Input:  query.sortBy = 'createdAt', query.order = 'desc'
// Output: { createdAt: -1 }
export function parseSortParams(query, allowedFields = ['createdAt', 'updatedAt']) {
  const sortBy = query.sortBy || 'createdAt'
  const order  = query.order === 'asc' ? 1 : -1

  if (!allowedFields.includes(sortBy)) {
    return { createdAt: -1 }
  }

  return { [sortBy]: order }
}