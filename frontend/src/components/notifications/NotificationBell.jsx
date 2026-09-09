// NotificationBell.jsx — Notification bell with unread badge
import { useNavigate } from 'react-router-dom'
import useNotificationStore from '../../store/notificationStore.js'
import { ROUTES } from '../../constants/routes.js'

export default function NotificationBell () {
  const { unreadCount } = useNotificationStore()
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(ROUTES.NOTIFICATIONS)}
      className='relative w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all'
    >
      <span className='text-xl'>🔔</span>
      {unreadCount > 0 && (
        <span
          className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white font-bold px-1'
          style={{ background: '#ef4444', fontSize: '10px' }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
