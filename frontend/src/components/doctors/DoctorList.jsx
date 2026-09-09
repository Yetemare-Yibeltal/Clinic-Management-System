// DoctorList.jsx — Grid of doctor cards with loading skeleton
import DoctorCard from './DoctorCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

function DoctorSkeleton () {
  return (
    <div className='glass-card rounded-2xl p-5 animate-pulse space-y-4'>
      <div className='flex gap-4'>
        <div
          className='w-16 h-16 rounded-xl'
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
        <div className='flex-1 space-y-2'>
          <div
            className='h-4 rounded w-32'
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          <div
            className='h-3 rounded w-24'
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
        </div>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className='h-12 rounded-lg'
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
      <div
        className='h-8 rounded'
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />
    </div>
  )
}

export default function DoctorList ({
  doctors = [],
  isLoading = false,
  onBook
}) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <DoctorSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        icon='👨‍⚕️'
        title='No doctors found'
        message='Try adjusting your search or filter to find what you are looking for.'
      />
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {doctors.map(doctor => (
        <DoctorCard key={doctor._id} doctor={doctor} onBook={onBook} />
      ))}
    </div>
  )
}
