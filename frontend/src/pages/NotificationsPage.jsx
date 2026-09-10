// NotificationsPage.jsx — Full notifications page
import { useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import NotificationList from '../components/notifications/NotificationList.jsx'
import Button from '../components/ui/Button.jsx'
import { useNotifications } from '../hooks/useNotifications.js'

export default function NotificationsPage () {
  const {
    notifications,
    isLoading,
    loadNotifications,
    markAllAsRead,
    deleteAllNotifications
  } = useNotifications()

  useEffect(() => {
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className='space-y-6 max-w-2xl'>
      <PageHeader
        title='Notifications'
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        icon='🔔'
        actions={
          notifications.length > 0 && (
            <div className='flex gap-2'>
              {unreadCount > 0 && (
                <Button size='sm' variant='secondary' onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button
                size='sm'
                variant='danger'
                onClick={deleteAllNotifications}
              >
                Clear all
              </Button>
            </div>
          )
        }
      />

      <NotificationList />
    </div>
  )
}
