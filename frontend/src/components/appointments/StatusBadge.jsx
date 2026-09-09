// StatusBadge.jsx — Appointment status badge
import Badge from '../ui/Badge.jsx'
import { APPOINTMENT_STATUS_LABELS } from '../../constants/status.js'

export default function StatusBadge ({ status, size = 'md' }) {
  const variantMap = {
    pending: 'pending',
    confirmed: 'confirmed',
    cancelled: 'cancelled',
    completed: 'completed',
    rescheduled: 'purple'
  }

  return (
    <Badge variant={variantMap[status] || 'default'} size={size}>
      {APPOINTMENT_STATUS_LABELS[status] || status}
    </Badge>
  )
}
