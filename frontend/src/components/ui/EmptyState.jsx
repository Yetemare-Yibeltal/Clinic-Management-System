// EmptyState.jsx — Empty state illustration with message and optional action
import Button from './Button.jsx'

export default function EmptyState ({
  icon = '📭',
  title = 'Nothing here yet',
  message = '',
  action = null,
  actionLabel = 'Get Started',
  onAction = null
}) {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <div className='text-6xl mb-4'>{icon}</div>
      <h3
        className='text-lg font-semibold text-white mb-2'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        {title}
      </h3>
      {message && (
        <p
          className='text-sm max-w-sm mb-6'
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {message}
        </p>
      )}
      {(action || onAction) && (
        <Button variant='primary' onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
