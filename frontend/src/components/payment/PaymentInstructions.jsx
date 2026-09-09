// PaymentInstructions.jsx — Step by step manual payment instructions
import { getPaymentInstructionSteps } from '../../utils/paymentUtils.js'
import { getPaymentMethod } from '../../utils/paymentUtils.js'
import { formatETB } from '../../utils/formatters.js'

export default function PaymentInstructions ({ method, amount }) {
  const methodInfo = getPaymentMethod(method)
  const steps = getPaymentInstructionSteps(method, amount)

  if (!methodInfo) return null

  return (
    <div className='space-y-4'>
      {/* ── Method header ──────────────────────── */}
      <div
        className='flex items-center gap-3 p-4 rounded-xl'
        style={{
          background: 'rgba(37,99,235,0.1)',
          border: '1px solid rgba(37,99,235,0.25)'
        }}
      >
        <span className='text-3xl'>{methodInfo.icon}</span>
        <div>
          <p className='text-sm font-bold text-white'>{methodInfo.label}</p>
          <p
            className='text-sm font-semibold mt-0.5'
            style={{ color: '#34d399' }}
          >
            Amount: {formatETB(amount)}
          </p>
        </div>
      </div>

      {/* ── Account info ────────────────────────── */}
      {methodInfo.accountInfo && (
        <div
          className='p-4 rounded-xl'
          style={{
            background: 'rgba(5,150,105,0.08)',
            border: '1px solid rgba(5,150,105,0.2)'
          }}
        >
          <p
            className='text-xs font-semibold mb-2'
            style={{ color: '#34d399' }}
          >
            Send to:
          </p>
          {methodInfo.accountInfo.number && (
            <p className='text-base font-bold text-white'>
              {methodInfo.accountInfo.number}
            </p>
          )}
          {methodInfo.accountInfo.name && (
            <p
              className='text-sm mt-0.5'
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {methodInfo.accountInfo.name}
            </p>
          )}
        </div>
      )}

      {/* ── Steps ──────────────────────────────── */}
      <div>
        <p
          className='text-xs font-semibold mb-3 uppercase tracking-wider'
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          How to Pay
        </p>
        <ol className='space-y-2'>
          {steps.map((step, i) => (
            <li key={i} className='flex items-start gap-3'>
              <span
                className='w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5'
                style={{
                  background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)'
                }}
              >
                {i + 1}
              </span>
              <p
                className='text-sm'
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
