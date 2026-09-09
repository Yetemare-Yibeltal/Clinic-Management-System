// HolidayManager.jsx — Admin holiday list and management
import { useEffect, useState } from 'react'
import { clinicService } from '../../services/clinicService.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import { formatDate } from '../../utils/formatters.js'
import api from '../../services/api.js'
import { API } from '../../constants/apiEndpoints.js'

export default function HolidayManager () {
  const [holidays, setHolidays] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadHolidays = async () => {
    setIsLoading(true)
    try {
      const res = await api.get(API.HOLIDAYS.LIST)
      setHolidays(res.data)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteHoliday = async id => {
    await api.delete(API.HOLIDAYS.DELETE(id))
    setHolidays(prev => prev.filter(h => h._id !== id))
  }

  useEffect(() => {
    loadHolidays()
  }, [])

  const typeColors = {
    ethiopian_public: 'green',
    religious: 'purple',
    clinic_specific: 'blue',
    emergency_closure: 'red',
    maintenance: 'yellow'
  }

  if (isLoading)
    return (
      <div className='flex justify-center py-8'>
        <Spinner />
      </div>
    )

  return (
    <div className='space-y-3'>
      {holidays.length === 0 ? (
        <p
          className='text-center py-8 text-sm'
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          No holidays configured
        </p>
      ) : (
        holidays.map(holiday => (
          <div
            key={holiday._id}
            className='flex items-center gap-3 p-4 rounded-xl'
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div className='flex-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <p className='text-sm font-medium text-white'>{holiday.name}</p>
                <Badge
                  variant={typeColors[holiday.type] || 'default'}
                  size='sm'
                >
                  {holiday.type.replace(/_/g, ' ')}
                </Badge>
                {holiday.isRecurringYearly && (
                  <Badge variant='blue' size='sm'>
                    Yearly
                  </Badge>
                )}
              </div>
              <p
                className='text-xs mt-1'
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {holiday.startDate === holiday.endDate
                  ? formatDate(holiday.startDate)
                  : `${formatDate(holiday.startDate)} — ${formatDate(
                      holiday.endDate
                    )}`}
              </p>
            </div>
            <Button
              size='xs'
              variant='danger'
              onClick={() => deleteHoliday(holiday._id)}
            >
              Remove
            </Button>
          </div>
        ))
      )}
    </div>
  )
}
