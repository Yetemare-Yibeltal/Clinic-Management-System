// AdminDashboardPage.jsx — Admin main dashboard
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import SystemStats from '../components/admin/SystemStats.jsx'
import StatsRow from '../components/dashboard/StatsRow.jsx'
import TodayAppointments from '../components/dashboard/TodayAppointments.jsx'
import RecentPayments from '../components/dashboard/RecentPayments.jsx'
import WorkloadChart from '../components/dashboard/WorkloadChart.jsx'
import TopDoctorsTable from '../components/reports/TopDoctorsTable.jsx'
import { adminService } from '../services/adminService.js'
import { reportService } from '../services/reportService.js'

export default function AdminDashboardPage () {
  const [systemStats, setSystemStats] = useState(null)
  const [dashStats, setDashStats] = useState(null)
  const [topDoctors, setTopDoctors] = useState([])
  const [revenue, setRevenue] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminService.getSystemStats(),
      reportService.getDashboard('month'),
      reportService.getTopDoctors(5),
      reportService.getMonthlyRevenue()
    ])
      .then(([sys, dash, docs, rev]) => {
        setSystemStats(sys)
        setDashStats(dash)
        setTopDoctors(docs)
        setRevenue(rev)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Admin Dashboard'
        subtitle='Kidus Yared Healthcare — System Overview'
        icon='🏥'
      />

      <SystemStats stats={systemStats} isLoading={isLoading} />

      <StatsRow stats={dashStats} isLoading={isLoading} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <WorkloadChart data={revenue} isLoading={isLoading} />
        </div>
        <TodayAppointments />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <RecentPayments />
        <TopDoctorsTable doctors={topDoctors} isLoading={isLoading} />
      </div>
    </div>
  )
}
