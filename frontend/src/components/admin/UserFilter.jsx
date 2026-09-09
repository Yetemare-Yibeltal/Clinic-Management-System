// UserFilter.jsx — Filter bar for admin user management
import SearchBar from '../ui/SearchBar.jsx'
import Select from '../ui/Select.jsx'

export default function UserFilter ({ filters, onFilterChange }) {
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'patient', label: 'Patients' },
    { value: 'doctor', label: 'Doctors' },
    { value: 'admin', label: 'Admins' }
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ]

  return (
    <div className='flex flex-col sm:flex-row gap-3'>
      <SearchBar
        placeholder='Search by name, email or phone...'
        value={filters.q}
        onChange={val => onFilterChange({ q: val })}
        className='flex-1'
      />
      <Select
        name='role'
        value={filters.role}
        onChange={e => onFilterChange({ role: e.target.value })}
        options={roleOptions}
        className='w-full sm:w-40'
      />
      <Select
        name='isActive'
        value={filters.isActive}
        onChange={e => onFilterChange({ isActive: e.target.value })}
        options={statusOptions}
        className='w-full sm:w-40'
      />
    </div>
  )
}
