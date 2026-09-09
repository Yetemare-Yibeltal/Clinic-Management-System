// DateTimePicker.jsx — Step 2 of booking: pick date and time
import { useState, useEffect } from 'react'
import useDoctorStore from '../../store/doctorStore.js'
import TimePicker from '../ui/TimePicker.jsx'
import { getNextDates, formatDisplayDate } from '../../utils/dateUtils.js'

export default function DateTimePicker ({
  doctorId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}) {
  const { availableSlots, isLoadingSlots, fetchAvailableSlots } =
    useDoctorStore()
  const dates = getNextDates(14)

  useEffect(() => {
    if (doctorId && selectedDate) {
      fetchAvailableSlots(doctorId, selectedDate)
    }
  }, [doctorId, selectedDate])

  return (
    <div className='space-y-6'>
      {/* ── Date selection ──────────────────────── */}
      <div>
        <p
          className='text-sm font-medium mb-3'
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          Select Date
        </p>
        <div className='grid grid-cols-7 gap-2'>
          {dates.map(({ date, dayName, dayNumber, month }) => {
            const isSelected = selectedDate === date
            return (
              <button
                key={date}
                onClick={() => {
                  onDateChange(date)
                  onTimeChange('')
                }}
                className='flex flex-col items-center p-2 rounded-xl transition-all duration-200'
                style={
                  isSelected
                    ? {
                        background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                        border: '1px solid rgba(37,99,235,0.5)'
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }
                }
              >
                <p
                  className='text-xs font-medium'
                  style={{
                    color: isSelected
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(255,255,255,0.4)'
                  }}
                >
                  {dayName}
                </p>
                <p className='text-base font-bold text-white mt-0.5'>
                  {dayNumber}
                </p>
                <p
                  className='text-xs'
                  style={{
                    color: isSelected
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(255,255,255,0.35)'
                  }}
                >
                  {month}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Time slot selection ──────────────────── */}
      {selectedDate && (
        <TimePicker
          value={selectedTime}
          onChange={onTimeChange}
          availableSlots={availableSlots}
          isLoading={isLoadingSlots}
          label='Select Time Slot'
        />
      )}

      {selectedDate && selectedTime && (
        <div
          className='p-4 rounded-xl'
          style={{
            background: 'rgba(37,99,235,0.1)',
            border: '1px solid rgba(37,99,235,0.25)'
          }}
        >
          <p className='text-sm text-white'>
            ✅ <strong>{formatDisplayDate(selectedDate)}</strong> at{' '}
            <strong>{selectedTime}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
