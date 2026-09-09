// StatsRow.jsx — Row of KPI stat cards for dashboard
import StatCard from '../ui/StatCard.jsx'
import { formatETB } from '../../utils/formatters.js'

export default function StatsRow ({ stats, isLoading }) {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      <StatCard
        title='Total Patients'
        value={stats?.overview?.totalPatients?.toLocaleString()}
        icon='👥'
        color='blue'
        isLoading={isLoading}
        subtitle='Registered patients'
      />
      <StatCard
        title='Total Doctors'
        value={stats?.overview?.totalDoctors?.toLocaleString()}
        icon='👨‍⚕️'
        color='purple'
        isLoading={isLoading}
        subtitle='Active doctors'
      />
      <StatCard
        title='Appointments'
        value={stats?.appointments?.total?.toLocaleString()}
        icon='📅'
        color='green'
        isLoading={isLoading}
        subtitle={`${stats?.appointments?.pending || 0} pending`}
      />
      <StatCard
        title='Total Revenue'
        value={formatETB(stats?.overview?.totalRevenue)}
        icon='💰'
        color='yellow'
        isLoading={isLoading}
        subtitle='All time'
      />
    </div>
  )
}
