// PaymentPage.jsx — Payment flow for an appointment
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import PaymentMethodCard from '../components/payment/PaymentMethodCard.jsx'
import PaymentInstructions from '../components/payment/PaymentInstructions.jsx'
import ChapaCheckout from '../components/payment/ChapaCheckout.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import FileUpload from '../components/ui/FileUpload.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import { PAYMENT_METHODS } from '../constants/paymentMethods.js'
import { paymentService } from '../services/paymentService.js'
import { appointmentService } from '../services/appointmentService.js'
import {
  requiresFileUpload,
  requiresTransactionId
} from '../utils/paymentUtils.js'
import { formatETB } from '../utils/formatters.js'
import { useToast } from '../hooks/useToast.js'

export default function PaymentPage () {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [appointment, setAppointment] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [receiptFile, setReceiptFile] = useState(null)
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState('select') // 'select' | 'pay' | 'done'

  useEffect(() => {
    appointmentService
      .getAppointmentById(appointmentId)
      .then(data => setAppointment(data))
      .catch(() => error('Appointment not found'))
      .finally(() => setIsLoading(false))
  }, [appointmentId])

  const handleSubmitManual = async () => {
    if (!selectedMethod) {
      error('Please select a payment method')
      return
    }
    if (
      requiresTransactionId(selectedMethod) &&
      !transactionId &&
      !receiptFile
    ) {
      error('Please enter a transaction ID or upload a receipt')
      return
    }

    setIsSubmitting(true)
    try {
      await paymentService.submitManualPayment(
        {
          appointmentId,
          method: selectedMethod,
          manualTransactionId: transactionId,
          manualNote: note
        },
        receiptFile
      )

      success('Payment submitted! Awaiting admin confirmation.')
      setStep('done')
    } catch (err) {
      error(err.response?.data?.error || 'Failed to submit payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChapaInit = async aptId => {
    try {
      const result = await paymentService.initializeChapaPayment(aptId)
      return { success: true, data: result }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to initialize payment')
      return { success: false }
    }
  }

  if (isLoading)
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='xl' />
      </div>
    )
  if (!appointment) return <Alert type='error' title='Appointment not found' />

  if (step === 'done') {
    return (
      <div className='max-w-md mx-auto text-center py-16 space-y-4'>
        <p className='text-6xl'>✅</p>
        <h2 className='text-2xl font-bold text-white'>Payment Submitted!</h2>
        <p className='text-sm' style={{ color: 'rgba(255,255,255,0.55)' }}>
          Your payment is awaiting admin confirmation. You'll receive an email
          once confirmed.
        </p>
        <Button variant='primary' onClick={() => navigate('/appointments')}>
          View My Appointments
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-2xl'>
      <PageHeader
        title='Pay for Appointment'
        subtitle={`${appointment.date} at ${appointment.time} · ${formatETB(
          appointment.fee
        )}`}
        icon='💳'
      />

      {step === 'select' && (
        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-white'>
            Select Payment Method
          </h3>
          <div className='space-y-2'>
            {PAYMENT_METHODS.map(method => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isSelected={selectedMethod === method.id}
                onSelect={setSelectedMethod}
              />
            ))}
          </div>

          <Button
            variant='primary'
            fullWidth
            size='lg'
            disabled={!selectedMethod}
            onClick={() => setStep('pay')}
          >
            Continue with{' '}
            {selectedMethod
              ? PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label
              : 'Payment'}{' '}
            →
          </Button>
        </div>
      )}

      {step === 'pay' && (
        <div className='space-y-5'>
          <button
            onClick={() => setStep('select')}
            className='text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1'
          >
            ← Change payment method
          </button>

          {selectedMethod === 'chapa' ? (
            <ChapaCheckout
              appointmentId={appointmentId}
              amount={appointment.fee}
              onInitialize={handleChapaInit}
            />
          ) : (
            <>
              <PaymentInstructions
                method={selectedMethod}
                amount={appointment.fee}
              />

              {requiresTransactionId(selectedMethod) && (
                <Input
                  label='Transaction ID / Reference Number'
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder='Enter the transaction ID you received'
                />
              )}

              {requiresFileUpload(selectedMethod) && (
                <FileUpload
                  label='Upload Payment Screenshot (optional)'
                  hint='Screenshot of your payment confirmation'
                  onFileSelect={file => setReceiptFile(file)}
                />
              )}

              {selectedMethod === 'cash' && (
                <Input
                  label='Note (optional)'
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder='Any additional notes...'
                />
              )}

              <Button
                variant='primary'
                fullWidth
                size='lg'
                isLoading={isSubmitting}
                onClick={handleSubmitManual}
              >
                ✅ Submit Payment Proof
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
