// BookingSuccess.jsx — Success screen shown after appointment is booked
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { formatETB } from '../../utils/formatters.js'
import { ROUTES } from '../../constants/routes.js'

export default function BookingSuccess ({ appointment }) {
  const navigate = useNavigate()

  return (
    <div className='text-center py-8 space-y-6'>
      {/* ── Success icon ──────────────────────────── */}
      <div
        className='w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto'
        style={{
          background: 'rgba(5,150,105,0.15)',
          border: '2px solid rgba(5,150,105,0.3)'
        }}
      >
        ✅
      </div>

      <div>
        <h2
          className='text-2xl font-bold text-white mb-2'
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Appointment Booked!
        </h2>
        <p className='text-sm' style={{ color: 'rgba(255,255,255,0.55)' }}>
          Your appointment has been successfully booked and is pending
          confirmation.
        </p>
      </div>

      {/* ── Appointment details ───────────────────── */}
      {appointment && (
        <div
          className='text-left rounded-2xl p-5 mx-auto max-w-sm'
          style={{
            background: 'rgba(5,150,105,0.08)',
            border: '1px solid rgba(5,150,105,0.2)'
          }}
        >
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Date</span>
              <span className='text-white font-medium'>{appointment.date}</span>
            </div>
            <div className='flex justify-between'>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Time</span>
              <span className='text-white font-medium'>{appointment.time}</span>
            </div>
            <div className='flex justify-between'>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Fee</span>
              <span className='font-bold' style={{ color: '#34d399' }}>
                {formatETB(appointment.fee)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Actions ───────────────────────────────── */}
      <div className='flex flex-col sm:flex-row gap-3 justify-center'>
        <Button
          variant='primary'
          onClick={() => navigate(ROUTES.MY_APPOINTMENTS)}
        >
          View My Appointments
        </Button>
        <Button variant='secondary' onClick={() => navigate(ROUTES.DASHBOARD)}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
