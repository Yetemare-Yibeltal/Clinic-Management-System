// RecentPayments.jsx — Recent payments widget for dashboard
import { useEffect, useState } from 'react'
import { paymentService } from '../../services/paymentService.js'
import Badge from '../ui/Badge.jsx'
import Spinner from '../ui/Spinner.jsx'
import { formatETB, formatRelativeTime } from '../../utils/formatters.js'
import { getPaymentMethod } from '../../utils/paymentUtils.js'

export default function RecentPayments () {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    paymentService
      .getPayments({ limit: 5 })
      .then(data => setPayments(Array.isArray(data) ? data.slice(0, 5) : []))
      .finally(() => setIsLoading(false))
  }, [])

  const statusVariant = { pending: 'yellow', completed: 'green', failed: 'red' }

  return (
    <div className='glass-card rounded-2xl p-5'>
      <h3
        className='text-sm font-semibold text-white mb-4'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        Recent Payments
      </h3>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Spinner />
        </div>
      ) : payments.length === 0 ? (
        <p
          className='text-sm text-center py-8'
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          No payments yet
        </p>
      ) : (
        <div className='space-y-2'>
          {payments.map(payment => {
            const method = getPaymentMethod(payment.method)
            return (
              <div
                key={payment._id}
                className='flex items-center gap-3 p-3 rounded-xl'
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span className='text-xl'>{method?.icon || '💳'}</span>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-white truncate'>
                    {payment.patient?.firstName} {payment.patient?.lastName}
                  </p>
                  <p
                    className='text-xs'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {method?.label} · {formatRelativeTime(payment.createdAt)}
                  </p>
                </div>
                <div className='text-right flex-shrink-0'>
                  <p className='text-sm font-bold' style={{ color: '#34d399' }}>
                    {formatETB(payment.amount)}
                  </p>
                  <Badge
                    variant={statusVariant[payment.status] || 'default'}
                    size='sm'
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
