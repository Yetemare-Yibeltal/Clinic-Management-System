// ChapaCheckout.jsx — Chapa online payment redirect handler
import { useState } from 'react'
import Button from '../ui/Button.jsx'
import { formatETB } from '../../utils/formatters.js'

export default function ChapaCheckout ({
  appointmentId,
  amount,
  onInitialize,
  isLoading
}) {
  const [checkoutUrl, setCheckoutUrl] = useState(null)

  const handleInitialize = async () => {
    const result = await onInitialize(appointmentId)
    if (result?.success && result?.data?.checkoutUrl) {
      setCheckoutUrl(result.data.checkoutUrl)
    }
  }

  if (checkoutUrl) {
    return (
      <div className='space-y-4 text-center'>
        <div
          className='p-6 rounded-2xl'
          style={{
            background: 'rgba(37,99,235,0.1)',
            border: '1px solid rgba(37,99,235,0.25)'
          }}
        >
          <p className='text-4xl mb-3'>💳</p>
          <h3 className='text-lg font-bold text-white mb-2'>Ready to Pay</h3>
          <p
            className='text-sm mb-4'
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Amount: <strong className='text-white'>{formatETB(amount)}</strong>
          </p>
          <Button
            variant='primary'
            size='lg'
            fullWidth
            onClick={() => window.open(checkoutUrl, '_blank')}
          >
            Open Chapa Payment Page →
          </Button>
        </div>
        <p className='text-xs' style={{ color: 'rgba(255,255,255,0.35)' }}>
          You'll be redirected to Chapa's secure payment page. After payment,
          come back here to verify.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4 text-center'>
      <div
        className='p-6 rounded-2xl'
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <p className='text-4xl mb-3'>💳</p>
        <h3 className='text-lg font-bold text-white mb-2'>Pay with Chapa</h3>
        <p className='text-sm mb-1' style={{ color: 'rgba(255,255,255,0.55)' }}>
          Pay securely using TeleBirr, CBE Birr, Awash Birr, HelloCash, or Card
        </p>
        <p className='text-xl font-bold mt-3 mb-5' style={{ color: '#34d399' }}>
          {formatETB(amount)}
        </p>
        <Button
          variant='primary'
          size='lg'
          fullWidth
          isLoading={isLoading}
          onClick={handleInitialize}
        >
          Initialize Payment
        </Button>
      </div>
    </div>
  )
}
