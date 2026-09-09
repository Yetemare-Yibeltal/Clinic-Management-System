// DoctorStats.jsx — Doctor performance stats widget
import StatCard from '../ui/StatCard.jsx'

export default function DoctorStats ({ stats, isLoading }) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      <StatCard
        title='Total Patients'
        value={stats?.totalPatients}
        icon='👥'
        color='blue'
        isLoading={isLoading}
      />
      <StatCard
        title='Completed'
        value={stats?.completed}
        icon='✅'
        color='green'
        isLoading={isLoading}
      />
      <StatCard
        title='Avg Rating'
        value={stats?.averageRating}
        icon='⭐'
        color='yellow'
        isLoading={isLoading}
      />
      <StatCard
        title='Total Reviews'
        value={stats?.totalReviews}
        icon='💬'
        color='purple'
        isLoading={isLoading}
      />
    </div>
  )
}
