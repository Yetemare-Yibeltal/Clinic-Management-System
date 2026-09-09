// BookingSummary.jsx — Step 5: review booking before confirming
import { formatETB, formatDisplayDate } from '../../utils/formatters.js'
import { getPaymentMethodLabel } from '../../constants/paymentMethods.js'

export default function BookingSummary ({
  doctor,
  date,
  time,
  type,
  visitMode,
  symptoms,
  paymentMethod,
  fee
}) {
  const rows = [
    { label: 'Doctor', value: `Dr. ${doctor?.firstName} ${doctor?.lastName}` },
    { label: 'Specialization', value: doctor?.specialization },
    { label: 'Date', value: date },
    { label: 'Time', value: time },
    { label: 'Type', value: type },
    {
      label: 'Visit Mode',
      value: visitMode === 'video-call' ? '📹 Video Call' : '🏥 In-Person'
    },
    { label: 'Payment Method', value: getPaymentMethodLabel(paymentMethod) }
  ]

  return (
    <div className='space-y-4'>
      <div
        className='rounded-2xl overflow-hidden'
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            className='flex justify-between px-5 py-3 text-sm'
            style={{
              borderBottom:
                i < rows.length - 1
                  ? '1px solid rgba(255,255,255,0.06)'
                  : 'none',
              background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
            <span className='text-white font-medium text-right'>
              {value || '—'}
            </span>
          </div>
        ))}
        <div
          className='flex justify-between px-5 py-4'
          style={{
            background: 'rgba(5,150,105,0.1)',
            borderTop: '1px solid rgba(5,150,105,0.2)'
          }}
        >
          <span className='text-sm font-bold' style={{ color: '#34d399' }}>
            Consultation Fee
          </span>
          <span className='text-lg font-bold' style={{ color: '#34d399' }}>
            {formatETB(fee)}
          </span>
        </div>
      </div>

      {symptoms && (
        <div
          className='px-5 py-4 rounded-xl'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <p
            className='text-xs mb-1'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Symptoms
          </p>
          <p className='text-sm text-white'>{symptoms}</p>
        </div>
      )}
    </div>
  )
}
