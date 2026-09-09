// PaymentReceipt.jsx — Printable payment receipt
import Button from '../ui/Button.jsx'
import { formatETB } from '../../utils/formatters.js'
import { getPaymentMethod } from '../../utils/paymentUtils.js'

export default function PaymentReceipt ({ receipt, onPrint }) {
  if (!receipt) return null

  const method = getPaymentMethod(receipt.payment?.methodCode)

  return (
    <div
      className='rounded-2xl overflow-hidden'
      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div
        className='p-6 text-center'
        style={{
          background:
            'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2))'
        }}
      >
        <p className='text-2xl mb-1'>🏥</p>
        <h2
          className='text-lg font-bold text-white'
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          {receipt.clinic?.name}
        </h2>
        <p className='text-xs mt-1' style={{ color: 'rgba(255,255,255,0.5)' }}>
          Official Payment Receipt
        </p>
        <p
          className='text-xs mt-0.5'
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          #{receipt.receiptNumber}
        </p>
      </div>

      {/* ── Details ─────────────────────────────── */}
      <div className='p-5 space-y-1'>
        {[
          { label: 'Patient', value: receipt.patient?.name },
          { label: 'Doctor', value: receipt.doctor?.name },
          { label: 'Date', value: receipt.appointment?.date },
          { label: 'Time', value: receipt.appointment?.time },
          { label: 'Method', value: method?.label || receipt.payment?.method },
          { label: 'Reference', value: receipt.payment?.transactionReference },
          {
            label: 'Receipt Date',
            value: new Date(receipt.issuedAt).toLocaleDateString()
          }
        ].map(
          ({ label, value }) =>
            value && (
              <div
                key={label}
                className='flex justify-between text-sm py-2'
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                <span className='text-white font-medium'>{value}</span>
              </div>
            )
        )}

        {/* Amount */}
        <div
          className='flex justify-between py-3 mt-2'
          style={{ borderTop: '2px solid rgba(5,150,105,0.3)' }}
        >
          <span className='text-base font-bold' style={{ color: '#34d399' }}>
            Total Paid
          </span>
          <span className='text-xl font-bold' style={{ color: '#34d399' }}>
            {receipt.payment?.amountFormatted ||
              formatETB(receipt.payment?.amountRaw)}
          </span>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div
        className='px-5 py-4 text-center'
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <p className='text-xs' style={{ color: 'rgba(255,255,255,0.35)' }}>
          {receipt.clinic?.address} · {receipt.clinic?.phone}
        </p>
        <div className='mt-3'>
          <Button size='sm' variant='secondary' onClick={onPrint}>
            🖨️ Print Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}
