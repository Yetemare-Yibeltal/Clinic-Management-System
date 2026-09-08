// Alert.jsx — Alert/notification banner component
export default function Alert ({
  type = 'info',
  title,
  message,
  onClose,
  className = ''
}) {
  const types = {
    info: {
      icon: 'ℹ️',
      bg: 'rgba(37,99,235,0.15)',
      border: 'rgba(37,99,235,0.3)',
      text: '#60a5fa'
    },
    success: {
      icon: '✅',
      bg: 'rgba(5,150,105,0.15)',
      border: 'rgba(5,150,105,0.3)',
      text: '#34d399'
    },
    warning: {
      icon: '⚠️',
      bg: 'rgba(217,119,6,0.15)',
      border: 'rgba(217,119,6,0.3)',
      text: '#fbbf24'
    },
    error: {
      icon: '❌',
      bg: 'rgba(220,38,38,0.15)',
      border: 'rgba(220,38,38,0.3)',
      text: '#f87171'
    }
  }

  const t = types[type] || types.info

  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3 ${className}`}
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <span className='text-lg flex-shrink-0 mt-0.5'>{t.icon}</span>
      <div className='flex-1 min-w-0'>
        {title && (
          <p className='text-sm font-semibold mb-0.5' style={{ color: t.text }}>
            {title}
          </p>
        )}
        {message && (
          <p className='text-sm' style={{ color: 'rgba(255,255,255,0.65)' }}>
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className='text-white/40 hover:text-white/80 transition-colors flex-shrink-0'
        >
          ✕
        </button>
      )}
    </div>
  )
}
