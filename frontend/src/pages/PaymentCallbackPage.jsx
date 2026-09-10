// PaymentCallbackPage.jsx — Handles Chapa payment redirect callback
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Spinner from '../components/ui/Spinner.jsx'
import Button from '../components/ui/Button.jsx'
import { paymentService } from '../services/paymentService.js'
import { ROUTES } from '../constants/routes.js'

export default function PaymentCallbackPage () {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying | success | failed
  const [message, setMessage] = useState('')

  const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref')

  useEffect(() => {
    if (!txRef) {
      setStatus('failed')
      setMessage('Invalid payment reference. Please contact support.')
      return
    }

    paymentService
      .verifyChapaPayment(txRef)
      .then(data => {
        setStatus('success')
        setMessage('Payment verified successfully!')
      })
      .catch(err => {
        setStatus('failed')
        setMessage(err.response?.data?.error || 'Payment verification failed.')
      })
  }, [txRef])

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ background: '#050b18' }}
    >
      <div className='text-center space-y-5'>
        {status === 'verifying' && (
          <>
            <Spinner size='xl' />
            <p className='text-lg font-semibold text-white'>
              Verifying your payment...
            </p>
            <p className='text-sm' style={{ color: 'rgba(255,255,255,0.5)' }}>
              Please wait while we confirm your payment with Chapa.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <p className='text-7xl'>✅</p>
            <h2 className='text-2xl font-bold text-white'>
              Payment Successful!
            </h2>
            <p className='text-sm' style={{ color: 'rgba(255,255,255,0.6)' }}>
              {message}
            </p>
            <Button
              variant='primary'
              onClick={() => navigate(ROUTES.MY_APPOINTMENTS)}
            >
              View My Appointments
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <p className='text-7xl'>❌</p>
            <h2 className='text-2xl font-bold text-white'>Payment Failed</h2>
            <p className='text-sm' style={{ color: 'rgba(255,255,255,0.6)' }}>
              {message}
            </p>
            <div className='flex gap-3 justify-center'>
              <Button
                variant='secondary'
                onClick={() => navigate(ROUTES.MY_APPOINTMENTS)}
              >
                My Appointments
              </Button>
              <Button
                variant='primary'
                onClick={() => navigate(ROUTES.DASHBOARD)}
              >
                Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
