// StatCard.jsx — KPI stat card for dashboards
export default function StatCard ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  color = 'blue',
  isLoading = false
}) {
  const colors = {
    blue: {
      bg: 'rgba(37,99,235,0.15)',
      border: 'rgba(37,99,235,0.25)',
      icon: 'rgba(37,99,235,0.3)',
      text: '#60a5fa'
    },
    purple: {
      bg: 'rgba(124,58,237,0.15)',
      border: 'rgba(124,58,237,0.25)',
      icon: 'rgba(124,58,237,0.3)',
      text: '#a78bfa'
    },
    green: {
      bg: 'rgba(5,150,105,0.15)',
      border: 'rgba(5,150,105,0.25)',
      icon: 'rgba(5,150,105,0.3)',
      text: '#34d399'
    },
    red: {
      bg: 'rgba(220,38,38,0.15)',
      border: 'rgba(220,38,38,0.25)',
      icon: 'rgba(220,38,38,0.3)',
      text: '#f87171'
    },
    yellow: {
      bg: 'rgba(217,119,6,0.15)',
      border: 'rgba(217,119,6,0.25)',
      icon: 'rgba(217,119,6,0.3)',
      text: '#fbbf24'
    },
    orange: {
      bg: 'rgba(234,88,12,0.15)',
      border: 'rgba(234,88,12,0.25)',
      icon: 'rgba(234,88,12,0.3)',
      text: '#fb923c'
    }
  }

  const c = colors[color] || colors.blue

  if (isLoading) {
    return (
      <div className='glass-card rounded-2xl p-6'>
        <div className='animate-pulse space-y-3'>
          <div
            className='h-3 rounded w-24'
            style={{ background: 'rgba(255,255,255,0.1)' }}
          />
          <div
            className='h-8 rounded w-16'
            style={{ background: 'rgba(255,255,255,0.1)' }}
          />
          <div
            className='h-2 rounded w-32'
            style={{ background: 'rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className='rounded-2xl p-6 transition-all duration-200 hover:translate-y-[-2px]'
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className='flex items-start justify-between mb-4'>
        <div>
          <p
            className='text-sm font-medium mb-1'
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {title}
          </p>
          <h3
            className='text-3xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {value ?? '—'}
          </h3>
        </div>
        {icon && (
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl'
            style={{ background: c.icon }}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend !== undefined) && (
        <div className='flex items-center gap-2'>
          {trend !== undefined && (
            <span
              className='text-xs font-semibold px-1.5 py-0.5 rounded'
              style={{
                color: trend >= 0 ? '#34d399' : '#f87171',
                background:
                  trend >= 0 ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)'
              }}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {subtitle && (
            <span
              className='text-xs'
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {subtitle}
            </span>
          )}
          {trendLabel && (
            <span
              className='text-xs'
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
