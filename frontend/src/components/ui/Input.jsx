// Input.jsx — Reusable input field with label, error, and icon support
export default function Input ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder = '',
  error = '',
  hint = '',
  icon = null,
  rightIcon = null,
  disabled = false,
  required = false,
  className = '',
  ...props
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
        {icon && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none'>
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className='w-full text-sm text-white placeholder-white/30 rounded-lg py-3 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${
              hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'
            }`,
            paddingLeft: icon ? '2.5rem' : '1rem',
            paddingRight: rightIcon ? '2.5rem' : '1rem'
          }}
          onFocus={e => {
            e.target.style.border = `1px solid ${
              hasError ? 'rgba(239,68,68,0.7)' : 'rgba(37,99,235,0.6)'
            }`
            e.target.style.boxShadow = hasError
              ? '0 0 0 3px rgba(239,68,68,0.1)'
              : '0 0 0 3px rgba(37,99,235,0.1)'
          }}
          onBlurCapture={e => {
            e.target.style.boxShadow = 'none'
            e.target.style.border = `1px solid ${
              hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'
            }`
          }}
          {...props}
        />

        {rightIcon && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2 text-white/40'>
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className='text-xs text-red-400 flex items-center gap-1'>
          <span>⚠</span> {error}
        </p>
      )}

      {hint && !error && (
        <p className='text-xs' style={{ color: 'rgba(255,255,255,0.35)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}
