// ProgressBar.jsx — Animated progress bar
export default function ProgressBar ({
  value = 0,
  max = 100,
  color = 'blue',
  size = 'md',
  showLabel = false,
  label,
  className = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    blue: 'linear-gradient(90deg,#1d4ed8,#7c3aed)',
    green: 'linear-gradient(90deg,#059669,#0d9488)',
    red: 'linear-gradient(90deg,#dc2626,#9f1239)',
    yellow: 'linear-gradient(90deg,#d97706,#b45309)',
    purple: 'linear-gradient(90deg,#7c3aed,#ec4899)'
  }

  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3', xl: 'h-4' }

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className='flex justify-between items-center mb-1.5'>
          {label && (
            <span
              className='text-xs'
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {label}
            </span>
          )}
          {showLabel && (
            <span className='text-xs font-semibold text-white'>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${heights[size]}`}
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className='h-full rounded-full transition-all duration-500 ease-out'
          style={{
            width: `${percentage}%`,
            background: colors[color] || colors.blue
          }}
        />
      </div>
    </div>
  )
}
