// AppointmentFilter.jsx — Filter bar for appointments
import SearchBar from '../ui/SearchBar.jsx'
import Select from '../ui/Select.jsx'
import { APPOINTMENT_STATUS_LABELS } from '../../constants/status.js'

export default function AppointmentFilter ({ filters, onFilterChange }) {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...Object.entries(APPOINTMENT_STATUS_LABELS).map(([v, l]) => ({
      value: v,
      label: l
    }))
  ]

  return (
    <div className='flex flex-col sm:flex-row gap-3'>
      <SearchBar
        placeholder='Search by patient or doctor name...'
        value={filters.q}
        onChange={val => onFilterChange({ q: val })}
        className='flex-1'
      />
      <Select
        name='status'
        value={filters.status}
        onChange={e => onFilterChange({ status: e.target.value })}
        options={statusOptions}
        className='w-full sm:w-48'
      />
      <input
        type='date'
        value={filters.date}
        onChange={e => onFilterChange({ date: e.target.value })}
        className='text-sm text-white rounded-xl px-4 py-2.5 outline-none w-full sm:w-44'
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          colorScheme: 'dark'
        }}
      />
    </div>
  )
}
