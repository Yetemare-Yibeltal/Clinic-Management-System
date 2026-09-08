// Dropdown.jsx — Dropdown menu with click-outside close
import { useState, useRef, useEffect } from 'react'

export default function Dropdown ({ trigger, items = [], align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative' ref={ref}>
      <div onClick={() => setIsOpen(prev => !prev)}>{trigger}</div>

      {isOpen && (
        <div
          className='absolute z-50 mt-2 rounded-xl overflow-hidden'
          style={{
            minWidth: '180px',
            background: 'rgba(15,23,42,0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
            [align === 'right' ? 'right' : 'left']: 0
          }}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div
                key={i}
                className='h-px my-1'
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.()
                  setIsOpen(false)
                }}
                disabled={item.disabled}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed'
                style={{
                  color: item.danger ? '#f87171' : 'rgba(255,255,255,0.7)',
                  background: 'transparent'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = item.danger
                    ? 'rgba(220,38,38,0.1)'
                    : 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
