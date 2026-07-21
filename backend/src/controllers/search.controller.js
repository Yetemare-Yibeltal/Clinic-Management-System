// search.controller.js — Unified search across doctors patients and appointments
import User from '../models/User.model.js'
import Appointment from '../models/Appointment.model.js'

// GET /api/search?q=ahmed&type=all
export async function globalSearch(req, res, next) {
  try {
    const { q, type = 'all', limit = 5 } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters.' })
    }

    const searchRegex = { $regex: q.trim(), $options: 'i' }
    const maxResults  = Math.min(Number(limit), 20)
    const results     = {}

    // Search doctors
    if (type === 'all' || type === 'doctors') {
      results.doctors = await User.find({
        role:     'doctor',
        isActive: true,
        $or: [
          { firstName:      searchRegex },
          { lastName:       searchRegex },
          { specialization: searchRegex },
        ],
      })
        .select('firstName lastName specialization consultationFee averageRating avatar initials')
        .limit(maxResults)
    }

    // Search patients (admin and doctors only)
    if (
      (type === 'all' || type === 'patients') &&
      (req.user.role === 'admin' || req.user.role === 'doctor')
    ) {
      results.patients = await User.find({
        role:     'patient',
        isActive: true,
        $or: [
          { firstName: searchRegex },
          { lastName:  searchRegex },
          { email:     searchRegex },
          { phone:     searchRegex },
        ],
      })
        .select('firstName lastName email phone city avatar initials')
        .limit(maxResults)
    }

    // Search appointments (role-scoped)
    if (type === 'all' || type === 'appointments') {
      const appointmentFilter = {}
      if (req.user.role === 'patient') appointmentFilter.patient = req.user._id
      if (req.user.role === 'doctor')  appointmentFilter.doctor  = req.user._id

      const appointments = await Appointment.find(appointmentFilter)
        .populate('patient', 'firstName lastName')
        .populate('doctor',  'firstName lastName specialization')
        .limit(maxResults * 3)

      results.appointments = appointments
        .filter((a) => {
          const patientName = `${a.patient?.firstName} ${a.patient?.lastName}`.toLowerCase()
          const doctorName  = `${a.doctor?.firstName} ${a.doctor?.lastName}`.toLowerCase()
          return (
            patientName.includes(q.toLowerCase()) ||
            doctorName.includes(q.toLowerCase())  ||
            a.date.includes(q)
          )
        })
        .slice(0, maxResults)
        .map((a) => ({
          _id:     a._id,
          date:    a.date,
          time:    a.time,
          status:  a.status,
          patient: a.patient,
          doctor:  a.doctor,
        }))
    }

    res.json({ query: q, results })
  } catch (err) { next(err) }
}

// GET /api/search/doctors
export async function searchDoctors(req, res, next) {
  try {
    const { q, spec, minFee, maxFee, minRating, page = 1, limit = 12 } = req.query
    const skip   = (Number(page) - 1) * Number(limit)
    const filter = { role: 'doctor', isActive: true, available: true }

    if (spec && spec !== 'All') filter.specialization = spec

    if (q) {
      filter.$or = [
        { firstName:      { $regex: q, $options: 'i' } },
        { lastName:       { $regex: q, $options: 'i' } },
        { specialization: { $regex: q, $options: 'i' } },
        { bio:            { $regex: q, $options: 'i' } },
      ]
    }

    if (minFee || maxFee) {
      filter.consultationFee = {}
      if (minFee) filter.consultationFee.$gte = Number(minFee)
      if (maxFee) filter.consultationFee.$lte = Number(maxFee)
    }

    if (minRating) filter.averageRating = { $gte: Number(minRating) }

    const [doctors, total] = await Promise.all([
      User.find(filter)
        .select('firstName lastName specialization consultationFee averageRating totalReviews bio avatar initials available department')
        .populate('department', 'name')
        .sort({ averageRating: -1, firstName: 1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ])

    res.json({
      doctors,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (err) { next(err) }
}