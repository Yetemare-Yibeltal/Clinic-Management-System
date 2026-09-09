// NotificationItem.jsx — Single notification row
import { formatRelativeTime } from '../../utils/formatters.js'

const TYPE_ICONS = {
  appointment_confirmed: '✅',
  appointment_cancelled: '❌',
  appointment_reminder: '⏰',
  appointment_rescheduled: '🔄',
  appointment_completed: '🎉',
  payment_confirmed: '💰',
  payment_rejected: '⚠️',
  payment_reminder: '💳',
  new_appointment: '📅',
  schedule_updated: '🗓️',
  review_received: '⭐',
  welcome: '👋',
  password_reset: '🔐',
  general: '📢'
}

export default function NotificationItem ({
  notification,
  onMarkRead,
  onDelete
}) {
  return (
    <div
      onClick={() => !notification.isRead && onMarkRead?.(notification._id)}
      className='flex items-start gap-3 p-4 rounded-xl transition-all cursor-pointer'
      style={{
        background: notification.isRead
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(37,99,235,0.08)',
        border: `1px solid ${
          notification.isRead ? 'rgba(255,255,255,0.06)' : 'rgba(37,99,235,0.2)'
        }`
      }}
    >
      <div
        className='w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0'
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        {TYPE_ICONS[notification.type] || '📢'}
      </div>

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-white'>{notification.title}</p>
        <p
          className='text-xs mt-0.5 leading-relaxed'
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {notification.message}
        </p>
        <p className='text-xs mt-1' style={{ color: 'rgba(255,255,255,0.3)' }}>
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      <div className='flex items-center gap-2 flex-shrink-0'>
        {!notification.isRead && (
          <div
            className='w-2 h-2 rounded-full'
            style={{ background: '#3b82f6' }}
          />
        )}
        <button
          onClick={e => {
            e.stopPropagation()
            onDelete?.(notification._id)
          }}
          className='text-white/20 hover:text-white/60 transition-colors text-xs'
        >
          ✕
        </button>
      </div>
    </div>
  )
}
  