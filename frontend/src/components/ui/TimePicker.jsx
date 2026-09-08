// TimePicker.jsx — Time slot picker for appointment booking
import { TIME_SLOTS } from '../../constants/timeSlots.js'

export default function TimePicker ({
  value,
  onChange,
  availableSlots = [],
  isLoading = false,
  label = 'Select Time',
  className = ''
}) {
  const periods = ['Morning', 'Afternoon', 'Evening']

  const slotsByPeriod = periods.reduce((acc, period) => {
    acc[period] = TIME_SLOTS.filter(s => s.period === period)
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className={className}>
        {label && (
          <p
            className='text-sm font-medium mb-3'
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {label}
          </p>
        )}
        <div className='grid grid-cols-3 gap-2'>
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className='h-10 rounded-lg animate-pulse'
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {label && (
        <p
          className='text-sm font-medium mb-3'
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {label}
        </p>
      )}

      {availableSlots.length === 0 ? (
        <div
          className='text-center py-6 rounded-xl'
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <p className='text-sm' style={{ color: 'rgba(255,255,255,0.4)' }}>
            No available slots for this date
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {periods.map(period => {
            const slots = slotsByPeriod[period].filter(s =>
              availableSlots.includes(s.time)
            )
            if (slots.length === 0) return null

            return (
              <div key={period}>
                <p
                  className='text-xs font-semibold mb-2 uppercase tracking-wider'
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {period}
                </p>
                <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                  {slots.map(slot => {
                    const isSelected = value === slot.time
                    return (
                      <button
                        key={slot.time}
                        onClick={() => onChange?.(slot.time)}
                        className='py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200'
                        style={
                          isSelected
                            ? {
                                background:
                                  'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                                color: '#fff',
                                border: '1px solid rgba(37,99,235,0.5)'
                              }
                            : {
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.75)'
                              }
                        }
                      >
                        {slot.time}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
