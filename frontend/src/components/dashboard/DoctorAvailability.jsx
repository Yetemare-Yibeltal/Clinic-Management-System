// DoctorAvailability.jsx — List of available doctors widget
import { useEffect } from 'react'
import useDoctorStore from '../../store/doctorStore.js'
import { formatETB } from '../../utils/formatters.js'
import Spinner from '../ui/Spinner.jsx'
import { useNavigate } from 'react-router-dom'

export default function DoctorAvailability () {
  const { doctors, isLoading, fetchDoctors } = useDoctorStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDoctors({ available: true, limit: 6 })
  }, [])

  const availableDoctors = doctors.filter(d => d.available).slice(0, 6)

  return (
    <div className='glass-card rounded-2xl p-5'>
      <h3
        className='text-sm font-semibold text-white mb-4'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        Available Doctors
      </h3>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Spinner />
        </div>
      ) : (
        <div className='space-y-2'>
          {availableDoctors.map(doctor => (
            <div
              key={doctor._id}
              onClick={() => navigate(`/doctors/${doctor._id}`)}
              className='flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5'
            >
              <div
                className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                style={{
                  background: 'linear-gradient(135deg,#2563eb,#7c3aed)'
                }}
              >
                {doctor.initials}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-white truncate'>
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
                <p
                  className='text-xs truncate'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {doctor.specialization}
                </p>
              </div>
              <div className='text-right flex-shrink-0'>
                <p
                  className='text-xs font-semibold'
                  style={{ color: '#34d399' }}
                >
                  {formatETB(doctor.consultationFee)}
                </p>
                <div className='flex items-center gap-1 justify-end mt-0.5'>
                  <div
                    className='w-1.5 h-1.5 rounded-full'
                    style={{ background: '#10b981' }}
                  />
                  <span className='text-xs' style={{ color: '#10b981' }}>
                    Available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
