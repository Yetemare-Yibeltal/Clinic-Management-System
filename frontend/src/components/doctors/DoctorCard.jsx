// DoctorCard.jsx — Doctor listing card with rating, fee, and book button
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import {
  formatETB,
  formatExperience,
  formatRating,
  getRatingStars
} from '../../utils/formatters.js'
import { getImageUrl } from '../../utils/imageUtils.js'

export default function DoctorCard ({ doctor, onBook }) {
  const navigate = useNavigate()

  return (
    <div
      className='glass-card card-hover rounded-2xl p-5 flex flex-col gap-4 cursor-pointer'
      onClick={() => navigate(`/doctors/${doctor._id}`)}
    >
      {/* ── Header ─────────────────────────────────── */}
      <div className='flex items-start gap-4'>
        <div className='relative flex-shrink-0'>
          {doctor.avatar ? (
            <img
              src={getImageUrl(doctor.avatar)}
              alt={`Dr. ${doctor.firstName}`}
              className='w-16 h-16 rounded-xl object-cover'
            />
          ) : (
            <div
              className='w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white'
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
            >
              {doctor.initials}
            </div>
          )}
          {doctor.available && (
            <div
              className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2'
              style={{ background: '#10b981', borderColor: '#050b18' }}
            />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='font-bold text-white text-base leading-tight'>
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <p className='text-sm mt-0.5' style={{ color: '#60a5fa' }}>
            {doctor.specialization}
          </p>
          {doctor.department?.name && (
            <p
              className='text-xs mt-0.5'
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {doctor.department.name}
            </p>
          )}
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────── */}
      <div className='grid grid-cols-3 gap-2'>
        <div
          className='text-center p-2 rounded-lg'
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <p className='text-base font-bold text-white'>
            {formatRating(doctor.averageRating)}
          </p>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
            Rating
          </p>
        </div>
        <div
          className='text-center p-2 rounded-lg'
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <p className='text-base font-bold text-white'>
            {doctor.totalReviews || 0}
          </p>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
            Reviews
          </p>
        </div>
        <div
          className='text-center p-2 rounded-lg'
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <p className='text-base font-bold text-white'>
            {doctor.experienceYears || 0}y
          </p>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
            Exp
          </p>
        </div>
      </div>

      {/* ── Stars ──────────────────────────────────── */}
      <div className='flex items-center gap-2'>
        <span className='text-yellow-400 text-sm tracking-tight'>
          {getRatingStars(doctor.averageRating)}
        </span>
        <span className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
          ({doctor.totalReviews || 0})
        </span>
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <div className='flex items-center justify-between pt-2 border-t border-white/10'>
        <div>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
            Consultation Fee
          </p>
          <p className='text-base font-bold' style={{ color: '#34d399' }}>
            {formatETB(doctor.consultationFee)}
          </p>
        </div>
        <Button
          size='sm'
          variant={doctor.available ? 'primary' : 'secondary'}
          disabled={!doctor.available}
          onClick={e => {
            e.stopPropagation()
            onBook?.(doctor)
          }}
        >
          {doctor.available ? 'Book' : 'Unavailable'}
        </Button>
      </div>
    </div>
  )
}
