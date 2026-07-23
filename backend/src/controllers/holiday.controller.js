// holiday.controller.js — Clinic holidays and blocked dates management
import Holiday from '../models/Holiday.model.js'

// POST /api/holidays (admin only)
export async function createHoliday(req, res, next) {
  try {
    const {
      name, description, startDate, endDate,
      type, isRecurringYearly, affectedDoctors, isFullClosure,
    } = req.body

    const holiday = await Holiday.create({
      name,
      description:       description || '',
      startDate,
      endDate:           endDate || startDate,
      type:              type || 'ethiopian_public',
      isRecurringYearly: isRecurringYearly || false,
      affectedDoctors:   affectedDoctors || [],
      isFullClosure:     isFullClosure !== undefined ? isFullClosure : true,
      createdBy:         req.user._id,
    })

    res.status(201).json(holiday)
  } catch (err) { next(err) }
}

// GET /api/holidays
export async function getHolidays(req, res, next) {
  try {
    const { year, type } = req.query
    const filter = { isActive: true }
    if (type) filter.type = type

    if (year) {
      filter.$or = [
        {
          startDate: {
            $gte: `${year}-01-01`,
            $lte: `${year}-12-31`,
          },
        },
        { isRecurringYearly: true },
      ]
    }

    const holidays = await Holiday.find(filter)
      .sort({ startDate: 1 })
      .populate('createdBy', 'firstName lastName')

    res.json(holidays)
  } catch (err) { next(err) }
}

// GET /api/holidays/check?date=2025-09-11
export async function checkHoliday(req, res, next) {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required.' })
    }

    const isHoliday = await Holiday.isHoliday(date)
    const holiday   = isHoliday
      ? await Holiday.findOne({
          startDate: { $lte: date },
          endDate:   { $gte: date },
          isActive:  true,
        })
      : null

    res.json({
      date,
      isHoliday,
      holiday: holiday ? { name: holiday.name, type: holiday.type } : null,
    })
  } catch (err) { next(err) }
}

// PATCH /api/holidays/:id (admin only)
export async function updateHoliday(req, res, next) {
  try {
    const holiday = await Holiday.findById(req.params.id)
    if (!holiday) return res.status(404).json({ error: 'Holiday not found.' })

    const allowedFields = [
      'name', 'description', 'startDate', 'endDate',
      'type', 'isRecurringYearly', 'isFullClosure',
      'affectedDoctors', 'isActive',
    ]

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) holiday[field] = req.body[field]
    }

    await holiday.save()
    res.json(holiday)
  } catch (err) { next(err) }
}

// DELETE /api/holidays/:id (admin only)
export async function deleteHoliday(req, res, next) {
  try {
    const holiday = await Holiday.findById(req.params.id)
    if (!holiday) return res.status(404).json({ error: 'Holiday not found.' })
    await holiday.deleteOne()
    res.json({ message: 'Holiday removed successfully.' })
  } catch (err) { next(err) }
}