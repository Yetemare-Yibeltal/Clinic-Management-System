// SearchBar.jsx — Search input with clear button and debounce
import { useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce.js'

export default function SearchBar ({
  placeholder = 'Search...',
  onSearch,
  className = '',
  value,
  onChange
}) {
  const [localValue, setLocalValue] = useState('')
  const isControlled = value !== undefined

  const currentValue = isControlled ? value : localValue
  const debouncedValue = useDebounce(currentValue, 400)

  const handleChange = e => {
    const val = e.target.value
    if (!isControlled) setLocalValue(val)
    onChange?.(val)
  }

  const handleClear = () => {
    if (!isControlled) setLocalValue('')
    onChange?.('')
    onSearch?.('')
  }

  return (
    <div className={`relative ${className}`}>
      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none'>
        🔍
      </span>
      <input
        type='text'
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className='w-full text-sm text-white placeholder-white/30 rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all'
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        onFocus={e => {
          e.target.style.border = '1px solid rgba(37,99,235,0.6)'
          e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'
        }}
        onBlur={e => {
          e.target.style.border = '1px solid rgba(255,255,255,0.1)'
          e.target.style.boxShadow = 'none'
        }}
      />
      {currentValue && (
        <button
          onClick={handleClear}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors'
        >
          ✕
        </button>
      )}
    </div>
  )
}
