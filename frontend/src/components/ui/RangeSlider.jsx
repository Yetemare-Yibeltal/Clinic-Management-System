// RangeSlider.jsx — Range slider for fee filters
export default function RangeSlider ({
  label,
  min = 0,
  max = 1000,
  value,
  onChange,
  step = 50,
  unit = 'ETB',
  className = ''
}) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className='flex items-center justify-between'>
          <label
            className='text-sm font-medium'
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {label}
          </label>
          <span className='text-sm font-semibold text-white'>
            {value.toLocaleString()} {unit}
          </span>
        </div>
      )}

      <div
        className='relative h-2 rounded-full'
        style={{ background: 'rgba(255,255,255,0.1)' }}
      >
        <div
          className='absolute top-0 left-0 h-full rounded-full'
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg,#1d4ed8,#7c3aed)'
          }}
        />
        <input
          type='range'
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={e => onChange?.(Number(e.target.value))}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
        />
      </div>

      <div
        className='flex justify-between text-xs'
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        <span>
          {min.toLocaleString()} {unit}
        </span>
        <span>
          {max.toLocaleString()} {unit}
        </span>
      </div>
    </div>
  )
}
