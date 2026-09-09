// MiniCalendar.jsx — Small calendar widget showing selected date
import { useState } from 'react'
import { today, getWeekDates } from '../../utils/dateUtils.js'

export default function MiniCalendar ({ selectedDate, onDateSelect }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(null)
  const weekDates = getWeekDates(currentWeekStart)

  return (
    <div className='glass-card rounded-2xl p-5'>
      <div className='flex items-center justify-between mb-4'>
        <h3
          className='text-sm font-semibold text-white'
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Calendar
        </h3>
        <div className='flex gap-1'>
          <button
            onClick={() => {
              const d = new Date(weekDates[0].date)
              d.setDate(d.getDate() - 7)
              setCurrentWeekStart(d.toISOString().split('T')[0])
            }}
            className='w-6 h-6 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs'
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentWeekStart(null)}
            className='px-2 h-6 flex items-center justify-center rounded text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all'
          >
            Today
          </button>
          <button
            onClick={() => {
              const d = new Date(weekDates[6].date)
              d.setDate(d.getDate() + 1)
              setCurrentWeekStart(d.toISOString().split('T')[0])
            }}
            className='w-6 h-6 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs'
          >
            ›
          </button>
        </div>
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {weekDates.map(
          ({ date, dayShort, dayNumber, isToday: isTodayDate, isPast }) => {
            const isSelected = selectedDate === date
            return (
              <button
                key={date}
                onClick={() => onDateSelect?.(date)}
                disabled={isPast}
                className='flex flex-col items-center p-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed'
                style={
                  isSelected
                    ? { background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }
                    : isTodayDate
                    ? {
                        background: 'rgba(37,99,235,0.15)',
                        border: '1px solid rgba(37,99,235,0.3)'
                      }
                    : { background: 'transparent' }
                }
              >
                <p
                  className='text-xs'
                  style={{
                    color: isSelected
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(255,255,255,0.35)'
                  }}
                >
                  {dayShort}
                </p>
                <p className='text-sm font-semibold text-white mt-0.5'>
                  {dayNumber}
                </p>
              </button>
            )
          }
        )}
      </div>
    </div>
  )
}
