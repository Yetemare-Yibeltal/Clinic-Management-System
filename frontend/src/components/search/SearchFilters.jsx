// SearchFilters.jsx — Filter tabs for search results
export default function SearchFilters ({
  activeType,
  onTypeChange,
  resultCounts = {}
}) {
  const filters = [
    {
      value: 'all',
      label: 'All',
      count: Object.values(resultCounts).reduce((a, b) => a + b, 0)
    },
    { value: 'doctors', label: 'Doctors', count: resultCounts.doctors || 0 },
    { value: 'patients', label: 'Patients', count: resultCounts.patients || 0 },
    {
      value: 'appointments',
      label: 'Appointments',
      count: resultCounts.appointments || 0
    }
  ]

  return (
    <div className='flex gap-2 flex-wrap'>
      {filters.map(({ value, label, count }) => (
        <button
          key={value}
          onClick={() => onTypeChange(value)}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all'
          style={
            activeType === value
              ? {
                  background:
                    'linear-gradient(135deg,rgba(37,99,235,0.3),rgba(124,58,237,0.3))',
                  border: '1px solid rgba(37,99,235,0.4)',
                  color: '#fff'
                }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.55)'
                }
          }
        >
          {label}
          <span
            className='text-xs px-1.5 py-0.5 rounded-full'
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)'
            }}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  )
}
