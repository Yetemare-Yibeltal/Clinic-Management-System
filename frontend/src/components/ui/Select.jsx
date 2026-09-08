// Select.jsx — Reusable select dropdown with label and error
export default function Select ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error = '',
  disabled = false,
  required = false,
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
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className='w-full text-sm text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${
              hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'
            }`
          }}
        >
          {placeholder && (
            <option value='' disabled style={{ background: '#0f172a' }}>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: '#0f172a', color: '#e2e8f0' }}
            >
              {opt.label}
            </option>
          ))}
        </select>

        <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40'>
          ▾
        </div>
      </div>

      {error && (
        <p className='text-xs text-red-400 flex items-center gap-1'>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}
