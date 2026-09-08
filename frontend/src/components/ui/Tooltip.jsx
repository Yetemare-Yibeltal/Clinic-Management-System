// Tooltip.jsx — Hover tooltip component
import { useState } from 'react'

export default function Tooltip ({
  children,
  content,
  position = 'top',
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          className={`absolute z-50 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap pointer-events-none ${positions[position]}`}
          style={{
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
