// SystemStats.jsx — System overview stats for admin header
import StatCard from '../ui/StatCard.jsx'

export default function SystemStats ({ stats, isLoading }) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
      <StatCard
        title='Total Users'
        value={stats?.totalUsers}
        icon='👥'
        color='blue'
        isLoading={isLoading}
      />
      <StatCard
        title='Doctors'
        value={stats?.totalDoctors}
        icon='👨‍⚕️'
        color='purple'
        isLoading={isLoading}
      />
      <StatCard
        title='Patients'
        value={stats?.totalPatients}
        icon='🤒'
        color='green'
        isLoading={isLoading}
      />
      <StatCard
        title='Appointments'
        value={stats?.totalAppointments}
        icon='📅'
        color='yellow'
        isLoading={isLoading}
      />
      <StatCard
        title='Pending Payments'
        value={stats?.pendingPayments}
        icon='⏳'
        color='orange'
        isLoading={isLoading}
      />
    </div>
  )
}
