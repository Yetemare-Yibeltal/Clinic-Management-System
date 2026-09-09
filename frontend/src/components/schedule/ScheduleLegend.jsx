// ScheduleLegend.jsx — Color legend for the schedule grid
export default function ScheduleLegend () {
  const items = [
    {
      color: 'rgba(5,150,105,0.3)',
      border: 'rgba(5,150,105,0.5)',
      label: 'Available'
    },
    {
      color: 'rgba(37,99,235,0.3)',
      border: 'rgba(37,99,235,0.5)',
      label: 'Booked'
    },
    {
      color: 'rgba(217,119,6,0.3)',
      border: 'rgba(217,119,6,0.5)',
      label: 'Break'
    },
    {
      color: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.08)',
      label: 'Closed'
    }
  ]

  return (
    <div className='flex flex-wrap gap-4'>
      {items.map(({ color, border, label }) => (
        <div key={label} className='flex items-center gap-2'>
          <div
            className='w-5 h-5 rounded'
            style={{ background: color, border: `1px solid ${border}` }}
          />
          <span className='text-xs' style={{ color: 'rgba(255,255,255,0.5)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
