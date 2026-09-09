// TopDoctorsTable.jsx — Top performing doctors table for reports
import {
  formatETB,
  formatRating,
  getRatingStars
} from '../../utils/formatters.js'

export default function TopDoctorsTable ({ doctors = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className='glass-card rounded-2xl p-5 space-y-3 animate-pulse'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='h-12 rounded-xl'
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='glass-card rounded-2xl p-5'>
      <h3
        className='text-sm font-semibold text-white mb-4'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        Top Performing Doctors
      </h3>
      {doctors.length === 0 ? (
        <p
          className='text-center py-8 text-sm'
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          No data yet
        </p>
      ) : (
        <div className='space-y-2'>
          {doctors.map((doctor, index) => (
            <div
              key={doctor._id}
              className='flex items-center gap-3 p-3 rounded-xl'
              style={{
                background:
                  index === 0 ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.03)'
              }}
            >
              <span className='text-lg w-6 text-center'>
                {index === 0
                  ? '🥇'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : `${index + 1}.`}
              </span>
              <div
                className='w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0'
                style={{
                  background: 'linear-gradient(135deg,#2563eb,#7c3aed)'
                }}
              >
                {doctor.firstName?.[0]}
                {doctor.lastName?.[0]}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-white'>
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
                <p
                  className='text-xs'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {doctor.specialization}
                </p>
              </div>
              <div className='text-right flex-shrink-0'>
                <p className='text-sm font-bold text-white'>
                  {doctor.totalPatients}
                </p>
                <p
                  className='text-xs'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  patients
                </p>
              </div>
              <div className='text-right flex-shrink-0 hidden sm:block'>
                <p
                  className='text-xs font-semibold'
                  style={{ color: '#fbbf24' }}
                >
                  {getRatingStars(doctor.averageRating)}
                </p>
                <p
                  className='text-xs'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {formatRating(doctor.averageRating)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
