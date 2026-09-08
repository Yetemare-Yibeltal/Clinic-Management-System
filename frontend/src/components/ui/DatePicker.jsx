// DatePicker.jsx — Date input with min/max constraints
export default function DatePicker ({
  label,
  name,
  value,
  onChange,
  min,
  max,
  error = '',
  required = false,
  disabled = false,
  className = ''
}) {
  const hasError = !!error

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          className='text-sm font-medium'
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {label}
          {required && <span className='text-red-400 ml-1'>*</span>}
        </label>
      )}

      <div className='relative'>
        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none'>
          📅
        </span>
        <input
          type='date'
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          className='w-full text-sm text-white rounded-lg pl-10 pr-4 py-3 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${
              hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'
            }`,
            colorScheme: 'dark'
          }}
        />
      </div>

      {error && <p className='text-xs text-red-400'>⚠ {error}</p>}
    </div>
  )
}
