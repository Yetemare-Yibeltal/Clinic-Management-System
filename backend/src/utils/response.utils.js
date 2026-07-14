// response.utils.js — Standardized API response helpers
// Every controller uses these instead of raw res.json()
// so the frontend always gets a consistent response shape

// ── Success response ───────────────────────────────────
// Used for single resource responses
// Shape: { success: true, data: {...}, message: '...' }
export function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

// ── Created response ───────────────────────────────────
// Used when a new resource is created (POST requests)
// Shape: { success: true, data: {...}, message: '...' }
export function sendCreated(res, data, message = 'Created successfully') {
  return res.status(201).json({
    success: true,
    message,
    data,
  })
}

// ── Error response ─────────────────────────────────────
// Used for all error cases
// Shape: { success: false, error: '...', details: [...] }
export function sendError(res, message = 'Something went wrong', statusCode = 500, details = null) {
  const response = {
    success: false,
    error: message,
  }

  if (details) {
    response.details = details
  }

  return res.status(statusCode).json(response)
}

// ── Not found response ─────────────────────────────────
export function sendNotFound(res, message = 'Resource not found') {
  return res.status(404).json({
    success: false,
    error: message,
  })
}

// ── Unauthorized response ──────────────────────────────
export function sendUnauthorized(res, message = 'Authentication required') {
  return res.status(401).json({
    success: false,
    error: message,
  })
}

// ── Forbidden response ─────────────────────────────────
export function sendForbidden(res, message = 'You do not have permission') {
  return res.status(403).json({
    success: false,
    error: message,
  })
}

// ── Paginated list response ────────────────────────────
// Used for all list endpoints that support pagination
// Shape: { success: true, data: [...], pagination: {...} }
export function sendPaginated(res, data, pagination, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total:       pagination.total,
      page:        pagination.page,
      limit:       pagination.limit,
      totalPages:  Math.ceil(pagination.total / pagination.limit),
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1,
    },
  })
}

// ── Validation error response ──────────────────────────
// Used by validation middleware
export function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    error:   'Validation failed',
    details: errors,
  })
}