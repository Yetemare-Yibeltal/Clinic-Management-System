// BookAppointmentPage.jsx — Multi-step appointment booking flow
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import StepIndicator from '../components/booking/StepIndicator.jsx'
import DoctorSelector from '../components/booking/DoctorSelector.jsx'
import DateTimePicker from '../components/booking/DateTimePicker.jsx'
import PatientDetailsForm from '../components/booking/PatientDetailsForm.jsx'
import PaymentSelector from '../components/booking/PaymentSelector.jsx'
import BookingSummary from '../components/booking/BookingSummary.jsx'
import BookingSuccess from '../components/booking/BookingSuccess.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import useAppointmentStore from '../store/appointmentStore.js'
import useDoctorStore from '../store/doctorStore.js'
import { useToast } from '../hooks/useToast.js'

const STEPS = [
  'Select Doctor',
  'Choose Date & Time',
  'Visit Details',
  'Payment Method',
  'Review & Book'
]

export default function BookAppointmentPage () {
  const [searchParams] = useSearchParams()
  const preselectedId = searchParams.get('doctorId')
  const { success, error } = useToast()
  const { createAppointment, isCreating } = useAppointmentStore()
  const { fetchDoctorById } = useDoctorStore()

  const [step, setStep] = useState(0)
  const [booked, setBooked] = useState(null)

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [visitDetails, setVisitDetails] = useState({
    type: 'consultation',
    visitMode: 'in-person',
    priority: 'normal',
    symptoms: ''
  })

  // Preselect doctor from query param
  useEffect(() => {
    if (preselectedId) {
      fetchDoctorById(preselectedId).then(doc => {
        if (doc) {
          setSelectedDoctor(doc)
          setStep(1)
        }
      })
    }
  }, [preselectedId])

  const canProceed = () => {
    if (step === 0) return !!selectedDoctor
    if (step === 1) return !!(selectedDate && selectedTime)
    if (step === 2) return !!(visitDetails.type && visitDetails.visitMode)
    if (step === 3) return !!paymentMethod
    return true
  }

  const handleNext = () => {
    if (canProceed()) setStep(s => s + 1)
  }
  const handleBack = () => setStep(s => s - 1)

  const handleBook = async () => {
    const result = await createAppointment({
      doctorId: selectedDoctor._id,
      date: selectedDate,
      time: selectedTime,
      type: visitDetails.type,
      visitMode: visitDetails.visitMode,
      priority: visitDetails.priority,
      symptoms: visitDetails.symptoms,
      paymentMethod
    })

    if (result.success) {
      success('Appointment booked successfully!')
      setBooked(result.appointment)
    } else {
      error(result.error)
    }
  }

  if (booked) return <BookingSuccess appointment={booked} />

  return (
    <div className='space-y-6 max-w-3xl'>
      <PageHeader
        title='Book Appointment'
        subtitle='Schedule your visit with our doctors'
        icon='📅'
      />
      <StepIndicator steps={STEPS} currentStep={step} />

      <Card>
        {step === 0 && (
          <DoctorSelector
            selectedDoctor={selectedDoctor}
            onSelect={setSelectedDoctor}
          />
        )}
        {step === 1 && (
          <DateTimePicker
            doctorId={selectedDoctor?._id}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />
        )}
        {step === 2 && (
          <PatientDetailsForm
            values={visitDetails}
            onChange={(field, value) =>
              setVisitDetails(prev => ({ ...prev, [field]: value }))
            }
          />
        )}
        {step === 3 && (
          <PaymentSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        )}
        {step === 4 && (
          <BookingSummary
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedTime}
            type={visitDetails.type}
            visitMode={visitDetails.visitMode}
            symptoms={visitDetails.symptoms}
            paymentMethod={paymentMethod}
            fee={selectedDoctor?.consultationFee}
          />
        )}

        {/* ── Navigation ────────────────────────── */}
        <div className='flex justify-between mt-6 pt-4 border-t border-white/10'>
          {step > 0 ? (
            <Button variant='secondary' onClick={handleBack}>
              ← Back
            </Button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <Button
              variant='primary'
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue →
            </Button>
          ) : (
            <Button
              variant='success'
              onClick={handleBook}
              isLoading={isCreating}
            >
              ✅ Confirm Booking
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
