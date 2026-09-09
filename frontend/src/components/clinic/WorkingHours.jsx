// WorkingHours.jsx — Clinic working hours display
export default function WorkingHours ({ workingHours }) {
  if (!workingHours) return null

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase()

  return (
    <div className='glass-card rounded-2xl p-5'>
      <h3
        className='text-sm font-semibold text-white mb-4'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        Working Hours
      </h3>
      <div className='space-y-2'>
        {days.map(({ key, label }) => {
          const hours = workingHours[key]
          const isToday = today === key
          const isClosed = !hours?.isOpen

          return (
            <div
              key={key}
              className='flex items-center justify-between py-2 px-3 rounded-lg text-sm'
              style={{
                background: isToday ? 'rgba(37,99,235,0.1)' : 'transparent',
                border: isToday
                  ? '1px solid rgba(37,99,235,0.2)'
                  : '1px solid transparent'
              }}
            >
              <span
                style={{
                  color: isToday ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontWeight: isToday ? 600 : 400
                }}
              >
                {label}
                {isToday && (
                  <span className='ml-2 text-xs text-blue-400'>(Today)</span>
                )}
              </span>
              <span
                style={{
                  color: isClosed
                    ? '#f87171'
                    : isToday
                    ? '#34d399'
                    : 'rgba(255,255,255,0.5)'
                }}
              >
                {isClosed ? 'Closed' : `${hours.open} — ${hours.close}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
