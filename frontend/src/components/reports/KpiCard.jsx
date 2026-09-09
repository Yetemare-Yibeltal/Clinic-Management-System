// KpiCard.jsx — KPI metric card for reports page
import { formatETB } from '../../utils/formatters.js'

export default function KpiCard ({
  title,
  value,
  icon,
  color = 'blue',
  format = 'number',
  trend,
  subtitle
}) {
  const colors = {
    blue: {
      bg: 'rgba(37,99,235,0.12)',
      border: 'rgba(37,99,235,0.25)',
      text: '#60a5fa'
    },
    green: {
      bg: 'rgba(5,150,105,0.12)',
      border: 'rgba(5,150,105,0.25)',
      text: '#34d399'
    },
    purple: {
      bg: 'rgba(124,58,237,0.12)',
      border: 'rgba(124,58,237,0.25)',
      text: '#a78bfa'
    },
    yellow: {
      bg: 'rgba(217,119,6,0.12)',
      border: 'rgba(217,119,6,0.25)',
      text: '#fbbf24'
    },
    red: {
      bg: 'rgba(220,38,38,0.12)',
      border: 'rgba(220,38,38,0.25)',
      text: '#f87171'
    }
  }

  const c = colors[color] || colors.blue

  const displayValue =
    format === 'currency'
      ? formatETB(value)
      : format === 'percentage'
      ? `${value}%`
      : value?.toLocaleString() ?? '—'

  return (
    <div
      className='rounded-2xl p-5'
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className='flex items-start justify-between mb-3'>
        <p
          className='text-sm font-medium'
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {title}
        </p>
        <span className='text-2xl'>{icon}</span>
      </div>
      <p
        className='text-3xl font-bold text-white'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        {displayValue}
      </p>
      {(trend !== undefined || subtitle) && (
        <div className='flex items-center gap-2 mt-2'>
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
        </div>
      )}
    </div>
  )
}
