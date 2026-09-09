// DoctorProfile.jsx — Full doctor profile detail view
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import {
  formatETB,
  formatExperience,
  formatRating,
  getRatingStars
} from '../../utils/formatters.js'
import { getImageUrl } from '../../utils/imageUtils.js'

export default function DoctorProfile ({
  doctor,
  onBook,
  showBookButton = true
}) {
  if (!doctor) return null

  return (
    <div className='space-y-6'>
      {/* ── Header card ──────────────────────────── */}
      <div className='glass-card rounded-2xl p-6'>
        <div className='flex flex-col sm:flex-row gap-6'>
          <div className='flex-shrink-0'>
            {doctor.avatar ? (
              <img
                src={getImageUrl(doctor.avatar)}
                alt={`Dr. ${doctor.firstName}`}
                className='w-28 h-28 rounded-2xl object-cover'
              />
            ) : (
              <div
                className='w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-bold text-white'
                style={{
                  background: 'linear-gradient(135deg,#2563eb,#7c3aed)'
                }}
              >
                {doctor.initials}
              </div>
            )}
          </div>

          <div className='flex-1'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div>
                <h2
                  className='text-2xl font-bold text-white'
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Dr. {doctor.firstName} {doctor.lastName}
                </h2>
                <p className='text-blue-400 mt-1'>{doctor.specialization}</p>
                {doctor.department?.name && (
                  <p
                    className='text-sm mt-0.5'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {doctor.department.name}
                  </p>
                )}
              </div>
              <Badge variant={doctor.available ? 'green' : 'red'}>
                {doctor.available ? '● Available' : '● Unavailable'}
              </Badge>
            </div>

            <div className='flex flex-wrap gap-4 mt-4'>
              <div>
                <p
                  className='text-xs'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Rating
                </p>
                <div className='flex items-center gap-1 mt-0.5'>
                  <span className='text-yellow-400 text-sm'>
                    {getRatingStars(doctor.averageRating)}
                  </span>
                  <span className='text-sm font-semibold text-white'>
                    {formatRating(doctor.averageRating)}
                  </span>
                  <span
                    className='text-xs'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    ({doctor.totalReviews || 0})
                  </span>
                </div>
              </div>
              <div>
                <p
                  className='text-xs'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Experience
                </p>
                <p className='text-sm font-semibold text-white mt-0.5'>
                  {formatExperience(doctor.experienceYears)}
                </p>
              </div>
              <div>
                <p
                  className='text-xs'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Consultation Fee
                </p>
                <p
                  className='text-sm font-semibold mt-0.5'
                  style={{ color: '#34d399' }}
                >
                  {formatETB(doctor.consultationFee)}
                </p>
              </div>
            </div>

            {showBookButton && (
              <div className='mt-4'>
                <Button
                  variant='primary'
                  disabled={!doctor.available}
                  onClick={() => onBook?.(doctor)}
                >
                  📅 Book Appointment
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bio ──────────────────────────────────── */}
      {doctor.bio && (
        <div className='glass-card rounded-2xl p-6'>
          <h3 className='text-sm font-semibold text-white mb-3'>About</h3>
          <p
            className='text-sm leading-relaxed'
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {doctor.bio}
          </p>
        </div>
      )}

      {/* ── License ──────────────────────────────── */}
      {doctor.licenseNumber && (
        <div className='glass-card rounded-2xl p-4'>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
            License Number
          </p>
          <p className='text-sm font-medium text-white mt-1'>
            {doctor.licenseNumber}
          </p>
        </div>
      )}
    </div>
  )
}
