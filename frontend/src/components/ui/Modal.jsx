// Modal.jsx — Glassmorphism modal dialog
import { useEffect } from 'react'
import Button from './Button.jsx'

export default function Modal ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  footer = null
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = e => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizes[size]} rounded-2xl overflow-hidden`}
        style={{
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)'
        }}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className='flex items-center justify-between px-6 py-4 border-b border-white/10'>
            {title && (
              <h2
                className='text-lg font-bold text-white'
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className='w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all ml-auto'
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className='px-6 py-5 max-h-[70vh] overflow-y-auto'>{children}</div>

        {/* Footer */}
        {footer && (
          <div className='px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
