// TodayAppointments.jsx — Today's appointments list widget
import { useEffect, useState } from 'react'
import { reportService } from '../../services/reportService.js'
import StatusBadge from '../appointments/StatusBadge.jsx'
import Spinner from '../ui/Spinner.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function TodayAppointments () {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    reportService
      .getTodayStats()
      .then(res => setData(res.appointments || []))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className='glass-card rounded-2xl p-5'>
      <div className='flex items-center justify-between mb-4'>
        <h3
          className='text-sm font-semibold text-white'
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Today's Appointments
        </h3>
        <span
          className='text-xs px-2 py-0.5 rounded-full'
          style={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa' }}
        >
          {data.length} total
        </span>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Spinner />
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon='📅' title='No appointments today' />
      ) : (
        <div className='space-y-2 max-h-64 overflow-y-auto pr-1'>
          {data.map(apt => (
            <div
              key={apt._id}
              className='flex items-center gap-3 p-3 rounded-xl'
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0'
                style={{
                  background: 'linear-gradient(135deg,#2563eb,#7c3aed)'
                }}
              >
                {apt.patient?.firstName?.[0]}
                {apt.patient?.lastName?.[0]}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-white truncate'>
                  {apt.patient?.firstName} {apt.patient?.lastName}
                </p>
                <p
                  className='text-xs truncate'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {apt.time} · Dr. {apt.doctor?.firstName}
                </p>
              </div>
              <StatusBadge status={apt.status} size='sm' />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
