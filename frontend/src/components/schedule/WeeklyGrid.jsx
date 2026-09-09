// WeeklyGrid.jsx — Doctor weekly schedule grid editor
import SlotCell from './SlotCell.jsx'
import ScheduleLegend from './ScheduleLegend.jsx'
import { TIME_SLOTS, DAYS } from '../../constants/timeSlots.js'

export default function WeeklyGrid ({
  weeklyGrid = {},
  onSlotToggle,
  readOnly = false
}) {
  const getSlotStatus = (dayIndex, slotIndex) => {
    const dayGrid = weeklyGrid[String(dayIndex)]
    if (!dayGrid) return 'closed'
    return dayGrid[String(slotIndex)] || 'closed'
  }

  return (
    <div className='space-y-4'>
      <ScheduleLegend />

      <div className='overflow-x-auto'>
        <table className='w-full text-sm border-collapse'>
          <thead>
            <tr>
              <th
                className='w-24 pb-3 text-left px-2'
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}
              >
                Time
              </th>
              {DAYS.map(day => (
                <th
                  key={day.index}
                  className='pb-3 text-center px-1'
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}
                >
                  <p className='font-semibold'>{day.short}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(slot => (
              <tr key={slot.index}>
                <td
                  className='py-1 px-2 text-xs whitespace-nowrap'
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {slot.time}
                </td>
                {DAYS.map(day => {
                  const status = getSlotStatus(day.index, slot.index)
                  return (
                    <td key={day.index} className='py-1 px-1 text-center'>
                      <SlotCell
                        status={status}
                        readOnly={readOnly}
                        onClick={() =>
                          !readOnly &&
                          onSlotToggle?.(day.index, slot.index, status)
                        }
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
