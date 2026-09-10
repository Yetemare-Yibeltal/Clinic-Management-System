// DashboardPage.jsx — Role-aware dashboard for all users
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import PageHeader from '../components/layout/PageHeader.jsx'
import StatsRow from '../components/dashboard/StatsRow.jsx'
import TodayAppointments from '../components/dashboard/TodayAppointments.jsx'
import RecentPayments from '../components/dashboard/RecentPayments.jsx'
import DoctorAvailability from '../components/dashboard/DoctorAvailability.jsx'
import WorkloadChart from '../components/dashboard/WorkloadChart.jsx'
import { reportService } from '../services/reportService.js'
import useAppointmentStore from '../store/appointmentStore.js'

export default function DashboardPage () {
  const { user, isAdmin, isDoctor, isPatient } = useAuth()
  const { fetchAppointments, appointments } = useAppointmentStore()

  const [dashStats, setDashStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load () {
      try {
        if (isAdmin) {
          const [stats, revenue] = await Promise.all([
            reportService.getDashboard('month'),
            reportService.getMonthlyRevenue()
          ])
          setDashStats(stats)
          setChartData(revenue)
        } else {
          await fetchAppointments({ limit: 5 })
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [isAdmin])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={`${greeting()}, ${user?.firstName}! 👋`}
        subtitle={
          isAdmin
            ? 'Here is your clinic overview for today'
            : isDoctor
            ? 'Manage your appointments and patients'
            : 'Welcome to your health portal'
        }
        icon='📊'
      />

      {/* ── Admin dashboard ──────────────────────── */}
      {isAdmin && (
        <>
          <StatsRow stats={dashStats} isLoading={isLoading} />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
              <WorkloadChart data={chartData} isLoading={isLoading} />
            </div>
            <TodayAppointments />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <RecentPayments />
            <DoctorAvailability />
          </div>
        </>
      )}

      {/* ── Doctor dashboard ─────────────────────── */}
      {isDoctor && (
        <>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            {[
              {
                title: 'Today',
                value: appointments.filter(
                  a => a.date === new Date().toISOString().split('T')[0]
                ).length,
                icon: '📅',
                color: 'blue'
              },
              {
                title: 'Pending',
                value: appointments.filter(a => a.status === 'pending').length,
                icon: '⏳',
                color: 'yellow'
              },
              {
                title: 'Confirmed',
                value: appointments.filter(a => a.status === 'confirmed')
                  .length,
                icon: '✅',
                color: 'green'
              },
              {
                title: 'Completed',
                value: appointments.filter(a => a.status === 'completed')
                  .length,
                icon: '🎉',
                color: 'purple'
              }
            ].map(({ title, value, icon, color }) => (
              <div
                key={title}
                className='rounded-2xl p-5'
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-2xl'>{icon}</span>
                  <span className='text-2xl font-bold text-white'>{value}</span>
                </div>
                <p
                  className='text-xs mt-2'
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {title}
                </p>
              </div>
            ))}
          </div>
          <TodayAppointments />
        </>
      )}

      {/* ── Patient dashboard ────────────────────── */}
      {isPatient && (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-4'>
              <div
                className='glass-card rounded-2xl p-6'
                style={{
                  background:
                    'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(124,58,237,0.15))'
                }}
              >
                <h3
                  className='text-lg font-bold text-white mb-2'
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Book an Appointment
                </h3>
                <p
                  className='text-sm mb-4'
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Find the right doctor and book your appointment in minutes.
                </p>
                <a
                  href='/book-appointment'
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all'
                  style={{
                    background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)'
                  }}
                >
                  📅 Book Now
                </a>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {[
                  {
                    label: 'Total Appointments',
                    value: appointments.length,
                    icon: '📅'
                  },
                  {
                    label: 'Upcoming',
                    value: appointments.filter(a =>
                      ['pending', 'confirmed'].includes(a.status)
                    ).length,
                    icon: '⏰'
                  }
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className='glass-card rounded-2xl p-4 text-center'
                  >
                    <p className='text-3xl'>{icon}</p>
                    <p className='text-2xl font-bold text-white mt-2'>
                      {value}
                    </p>
                    <p
                      className='text-xs mt-1'
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <DoctorAvailability />
          </div>
        </>
      )}
    </div>
  )
}
