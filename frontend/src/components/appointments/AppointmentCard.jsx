// AppointmentCard.jsx — Single appointment card for lists
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import Button from '../ui/Button.jsx'
import { formatDate, formatETB } from '../../utils/formatters.js'
import useAuthStore from '../../store/authStore.js'

export default function AppointmentCard ({
  appointment,
  onCancel,
  onConfirm,
  onComplete
}) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { patient, doctor, date, time, type, status, fee, isPaid } = appointment

  const isPatient = user?.role === 'patient'
  const isDoctor = user?.role === 'doctor'
  const isAdmin = user?.role === 'admin'

  return (
    <div
      className='glass-card card-hover rounded-2xl p-5 cursor-pointer'
      onClick={() => navigate(`/appointments/${appointment._id}`)}
    >
      {/* ── Header ──────────────────────────────── */}
      <div className='flex items-start justify-between gap-3 mb-4'>
        <div>
          <div className='flex items-center gap-2 flex-wrap'>
            <StatusBadge status={status} />
            {isPaid ? (
              <span
                className='text-xs px-2 py-0.5 rounded-full font-medium'
                style={{ background: 'rgba(5,150,105,0.2)', color: '#34d399' }}
              >
                ✓ Paid
              </span>
            ) : (
              status !== 'cancelled' && (
                <span
                  className='text-xs px-2 py-0.5 rounded-full font-medium'
                  style={{
                    background: 'rgba(217,119,6,0.2)',
                    color: '#fbbf24'
                  }}
                >
                  Unpaid
                </span>
              )
            )}
          </div>
          <p
            className='text-xs mt-2 capitalize'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {type} ·{' '}
            {appointment.visitMode === 'video-call'
              ? '📹 Video Call'
              : '🏥 In-Person'}
          </p>
        </div>
        <div className='text-right flex-shrink-0'>
          <p className='text-sm font-bold text-white'>{date}</p>
          <p className='text-sm' style={{ color: '#60a5fa' }}>
            {time}
          </p>
        </div>
      </div>

      {/* ── People ──────────────────────────────── */}
      <div className='space-y-2 mb-4'>
        {(isAdmin || isDoctor) && patient && (
          <div className='flex items-center gap-2'>
            <div
              className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white'
              style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}
            >
              {patient.firstName?.[0]}
              {patient.lastName?.[0]}
            </div>
            <div>
              <p className='text-sm text-white'>
                {patient.firstName} {patient.lastName}
              </p>
              <p
                className='text-xs'
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {patient.phone}
              </p>
            </div>
          </div>
        )}
        {(isAdmin || isPatient) && doctor && (
          <div className='flex items-center gap-2'>
            <div
              className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white'
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
            >
              {doctor.firstName?.[0]}
              {doctor.lastName?.[0]}
            </div>
            <div>
              <p className='text-sm text-white'>
                Dr. {doctor.firstName} {doctor.lastName}
              </p>
              <p
                className='text-xs'
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {doctor.specialization}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div className='flex items-center justify-between pt-3 border-t border-white/10'>
        <p className='text-sm font-bold' style={{ color: '#34d399' }}>
          {formatETB(fee)}
        </p>
        <div className='flex gap-2' onClick={e => e.stopPropagation()}>
          {status === 'pending' && (isAdmin || isDoctor) && (
            <Button
              size='xs'
              variant='success'
              onClick={() => onConfirm?.(appointment)}
            >
              Confirm
            </Button>
          )}
          {status === 'confirmed' && isDoctor && (
            <Button
              size='xs'
              variant='primary'
              onClick={() => onComplete?.(appointment)}
            >
              Complete
            </Button>
          )}
          {['pending', 'confirmed'].includes(status) && (
            <Button
              size='xs'
              variant='danger'
              onClick={() => onCancel?.(appointment)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
