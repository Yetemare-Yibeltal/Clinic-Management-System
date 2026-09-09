// AuditLog.jsx — Audit log table for admin
import { formatRelativeTime } from '../../utils/formatters.js'
import Badge from '../ui/Badge.jsx'

export default function AuditLog ({ logs = [], isLoading }) {
  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='h-14 rounded-xl animate-pulse'
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <p
        className='text-center py-8 text-sm'
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        No audit logs found
      </p>
    )
  }

  const actionColors = {
    login: 'green',
    logout: 'default',
    register: 'blue',
    appointment_confirmed: 'green',
    appointment_cancelled: 'red',
    payment_confirmed: 'green',
    payment_rejected: 'red',
    user_activated: 'green',
    user_deactivated: 'red',
    user_deleted: 'red'
  }

  return (
    <div className='space-y-1.5'>
      {logs.map(log => (
        <div
          key={log._id}
          className='flex items-center gap-3 p-3 rounded-xl'
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <Badge variant={actionColors[log.action] || 'default'} size='sm'>
                {log.action.replace(/_/g, ' ')}
              </Badge>
              <span className='text-xs text-white/70'>{log.userEmail}</span>
            </div>
            {log.description && (
              <p
                className='text-xs mt-0.5'
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {log.description}
              </p>
            )}
          </div>
          <div className='text-right flex-shrink-0'>
            <Badge
              variant={log.status === 'success' ? 'green' : 'red'}
              size='sm'
            >
              {log.status}
            </Badge>
            <p
              className='text-xs mt-1'
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {formatRelativeTime(log.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
