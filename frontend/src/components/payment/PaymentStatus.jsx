// PaymentStatus.jsx — Payment status display card
import Badge from '../ui/Badge.jsx'
import { formatETB, formatRelativeTime } from '../../utils/formatters.js'
import { getPaymentMethod } from '../../utils/paymentUtils.js'
import { PAYMENT_STATUS_LABELS } from '../../constants/status.js'

export default function PaymentStatus ({ payment }) {
  if (!payment) return null

  const method = getPaymentMethod(payment.method)
  const statusVariant = {
    pending: 'yellow',
    completed: 'green',
    failed: 'red',
    refunded: 'blue',
    cancelled: 'default'
  }

  return (
    <div className='glass-card rounded-2xl p-5 space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-white'>Payment Status</h3>
        <Badge variant={statusVariant[payment.status] || 'default'}>
          {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
        </Badge>
      </div>

      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Amount</span>
          <span className='font-bold' style={{ color: '#34d399' }}>
            {formatETB(payment.amount)}
          </span>
        </div>
        <div className='flex justify-between'>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Method</span>
          <span className='text-white'>{method?.label || payment.method}</span>
        </div>
        {payment.chapaTxRef && (
          <div className='flex justify-between'>
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>Reference</span>
            <span className='text-white font-mono text-xs'>
              {payment.chapaTxRef}
            </span>
          </div>
        )}
        {payment.manualTransactionId && (
          <div className='flex justify-between'>
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>
              Transaction ID
            </span>
            <span className='text-white font-mono text-xs'>
              {payment.manualTransactionId}
            </span>
          </div>
        )}
        <div className='flex justify-between'>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Date</span>
          <span className='text-white'>
            {formatRelativeTime(payment.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
