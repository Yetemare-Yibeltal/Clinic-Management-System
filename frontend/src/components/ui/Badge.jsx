// Badge.jsx — Status and label badge component
export default function Badge ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  const variants = {
    default: {
      background: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.15)'
    },
    blue: {
      background: 'rgba(37,99,235,0.2)',
      color: '#60a5fa',
      border: '1px solid rgba(37,99,235,0.3)'
    },
    purple: {
      background: 'rgba(124,58,237,0.2)',
      color: '#a78bfa',
      border: '1px solid rgba(124,58,237,0.3)'
    },
    green: {
      background: 'rgba(5,150,105,0.2)',
      color: '#34d399',
      border: '1px solid rgba(5,150,105,0.3)'
    },
    red: {
      background: 'rgba(220,38,38,0.2)',
      color: '#f87171',
      border: '1px solid rgba(220,38,38,0.3)'
    },
    yellow: {
      background: 'rgba(217,119,6,0.2)',
      color: '#fbbf24',
      border: '1px solid rgba(217,119,6,0.3)'
    },
    orange: {
      background: 'rgba(234,88,12,0.2)',
      color: '#fb923c',
      border: '1px solid rgba(234,88,12,0.3)'
    },
    pending: {
      background: 'rgba(217,119,6,0.2)',
      color: '#fbbf24',
      border: '1px solid rgba(217,119,6,0.3)'
    },
    confirmed: {
      background: 'rgba(37,99,235,0.2)',
      color: '#60a5fa',
      border: '1px solid rgba(37,99,235,0.3)'
    },
    cancelled: {
      background: 'rgba(220,38,38,0.2)',
      color: '#f87171',
      border: '1px solid rgba(220,38,38,0.3)'
    },
    completed: {
      background: 'rgba(5,150,105,0.2)',
      color: '#34d399',
      border: '1px solid rgba(5,150,105,0.3)'
    },
    paid: {
      background: 'rgba(5,150,105,0.2)',
      color: '#34d399',
      border: '1px solid rgba(5,150,105,0.3)'
    },
    failed: {
      background: 'rgba(220,38,38,0.2)',
      color: '#f87171',
      border: '1px solid rgba(220,38,38,0.3)'
    },
    admin: {
      background: 'rgba(124,58,237,0.2)',
      color: '#a78bfa',
      border: '1px solid rgba(124,58,237,0.3)'
    },
    doctor: {
      background: 'rgba(37,99,235,0.2)',
      color: '#60a5fa',
      border: '1px solid rgba(37,99,235,0.3)'
    },
    patient: {
      background: 'rgba(5,150,105,0.2)',
      color: '#34d399',
      border: '1px solid rgba(5,150,105,0.3)'
    }
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  const style = variants[variant] || variants.default

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizes[size]} ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}
