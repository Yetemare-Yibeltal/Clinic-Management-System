// SearchResults.jsx — Global search results display
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../appointments/StatusBadge.jsx'
import { formatETB } from '../../utils/formatters.js'

export default function SearchResults ({ results = {}, query = '' }) {
  const navigate = useNavigate()
  const { doctors = [], patients = [], appointments = [] } = results
  const hasResults = doctors.length + patients.length + appointments.length > 0

  if (!hasResults) {
    return (
      <div className='text-center py-12'>
        <p className='text-4xl mb-3'>🔍</p>
        <p className='text-sm font-medium text-white'>
          No results for "{query}"
        </p>
        <p className='text-xs mt-1' style={{ color: 'rgba(255,255,255,0.4)' }}>
          Try a different search term
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {doctors.length > 0 && (
        <div>
          <p
            className='text-xs font-semibold uppercase tracking-wider mb-2'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Doctors ({doctors.length})
          </p>
          <div className='space-y-1.5'>
            {doctors.map(doc => (
              <div
                key={doc._id}
                onClick={() => navigate(`/doctors/${doc._id}`)}
                className='flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all'
              >
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white'
                  style={{
                    background: 'linear-gradient(135deg,#2563eb,#7c3aed)'
                  }}
                >
                  {doc.initials}
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-white'>
                    Dr. {doc.firstName} {doc.lastName}
                  </p>
                  <p
                    className='text-xs'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {doc.specialization}
                  </p>
                </div>
                <p
                  className='text-sm font-semibold'
                  style={{ color: '#34d399' }}
                >
                  {formatETB(doc.consultationFee)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {patients.length > 0 && (
        <div>
          <p
            className='text-xs font-semibold uppercase tracking-wider mb-2'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Patients ({patients.length})
          </p>
          <div className='space-y-1.5'>
            {patients.map(patient => (
              <div
                key={patient._id}
                className='flex items-center gap-3 p-3 rounded-xl'
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white'
                  style={{
                    background: 'linear-gradient(135deg,#059669,#0d9488)'
                  }}
                >
                  {patient.initials}
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-white'>
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p
                    className='text-xs'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {patient.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {appointments.length > 0 && (
        <div>
          <p
            className='text-xs font-semibold uppercase tracking-wider mb-2'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Appointments ({appointments.length})
          </p>
          <div className='space-y-1.5'>
            {appointments.map(apt => (
              <div
                key={apt._id}
                onClick={() => navigate(`/appointments/${apt._id}`)}
                className='flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all'
              >
                <span className='text-xl'>📅</span>
                <div className='flex-1'>
                  <p className='text-sm text-white'>
                    {apt.date} at {apt.time}
                  </p>
                  <p
                    className='text-xs'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {apt.patient?.firstName} → Dr. {apt.doctor?.firstName}
                  </p>
                </div>
                <StatusBadge status={apt.status} size='sm' />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
