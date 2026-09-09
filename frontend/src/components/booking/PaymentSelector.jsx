// PaymentSelector.jsx — Step 4 of booking: choose payment method
import { PAYMENT_METHODS } from '../../constants/paymentMethods.js'

export default function PaymentSelector ({ selectedMethod, onSelect }) {
  return (
    <div className='space-y-3'>
      <p className='text-sm' style={{ color: 'rgba(255,255,255,0.5)' }}>
        You can pay now online or pay at the clinic. Payment is required to
        confirm your appointment.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        {PAYMENT_METHODS.map(method => {
          const isSelected = selectedMethod === method.id
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className='flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200'
              style={
                isSelected
                  ? {
                      background: 'rgba(37,99,235,0.2)',
                      border: '1px solid rgba(37,99,235,0.5)'
                    }
                  : {
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }
              }
            >
              <span className='text-2xl'>{method.icon}</span>
              <div>
                <p className='text-sm font-medium text-white'>{method.label}</p>
                <p
                  className='text-xs mt-0.5'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {method.description}
                </p>
              </div>
              {isSelected && (
                <span className='ml-auto text-blue-400 text-lg'>✓</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
