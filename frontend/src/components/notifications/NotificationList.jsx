// NotificationList.jsx — Full notification list with mark all read
import NotificationItem from './NotificationItem.jsx'
import Button from '../ui/Button.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import Spinner from '../ui/Spinner.jsx'
import { useNotifications } from '../../hooks/useNotifications.js'

export default function NotificationList () {
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications()

  if (isLoading)
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='lg' />
      </div>
    )

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon='🔔'
        title='No notifications'
        message='You are all caught up! Notifications will appear here.'
      />
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className='space-y-4'>
      {unreadCount > 0 && (
        <div className='flex justify-end'>
          <Button size='sm' variant='ghost' onClick={markAllAsRead}>
            Mark all as read ({unreadCount})
          </Button>
        </div>
      )}

      <div className='space-y-2'>
        {notifications.map(notification => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
          />
        ))}
      </div>
    </div>
  )
}
