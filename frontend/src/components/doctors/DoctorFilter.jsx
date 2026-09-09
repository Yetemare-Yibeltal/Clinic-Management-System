// DoctorFilter.jsx — Filter panel for doctors list
import SearchBar from '../ui/SearchBar.jsx'
import Select from '../ui/Select.jsx'

export default function DoctorFilter ({
  filters,
  onFilterChange,
  specializations = []
}) {
  const specOptions = specializations.map(s => ({ value: s, label: s }))

  return (
    <div className='flex flex-col sm:flex-row gap-3'>
      <SearchBar
        placeholder='Search doctors by name or specialization...'
        value={filters.q}
        onChange={val => onFilterChange({ q: val })}
        className='flex-1'
      />
      <Select
        name='spec'
        value={filters.spec}
        onChange={e => onFilterChange({ spec: e.target.value })}
        options={[{ value: '', label: 'All Specializations' }, ...specOptions]}
        placeholder='All Specializations'
        className='w-full sm:w-56'
      />
    </div>
  )
}
