// ScheduleSummary.jsx — Summary stats of a doctor's schedule
export default function ScheduleSummary ({ weeklyGrid = {} }) {
  let totalAvail = 0
  let totalBooked = 0
  let totalBreak = 0

  Object.values(weeklyGrid).forEach(daySlots => {
    Object.values(daySlots || {}).forEach(status => {
      if (status === 'avail') totalAvail++
      if (status === 'booked') totalBooked++
      if (status === 'break') totalBreak++
    })
  })

  const stats = [
    {
      label: 'Available Slots',
      value: totalAvail,
      color: '#34d399',
      icon: '✅'
    },
    { label: 'Booked Slots', value: totalBooked, color: '#60a5fa', icon: '📅' },
    { label: 'Break Slots', value: totalBreak, color: '#fbbf24', icon: '☕' }
  ]

  return (
    <div className='grid grid-cols-3 gap-3'>
      {stats.map(({ label, value, color, icon }) => (
        <div
          key={label}
          className='text-center p-3 rounded-xl'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <p className='text-xl'>{icon}</p>
          <p className='text-xl font-bold mt-1' style={{ color }}>
            {value}
          </p>
          <p
            className='text-xs mt-0.5'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
