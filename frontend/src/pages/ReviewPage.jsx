// ReviewPage.jsx — Patient submits a review for a completed appointment
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import ReviewForm from '../components/reviews/ReviewForm.jsx'
import Card from '../components/ui/Card.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import { appointmentService } from '../services/appointmentService.js'
import { ROUTES } from '../constants/routes.js'

export default function ReviewPage () {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    appointmentService
      .getAppointmentById(appointmentId)
      .then(setAppointment)
      .finally(() => setIsLoading(false))
  }, [appointmentId])

  if (isLoading)
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='xl' />
      </div>
    )

  if (!appointment) return <Alert type='error' title='Appointment not found' />

  if (appointment.status !== 'completed') {
    return (
      <div className='max-w-md mx-auto'>
        <Alert
          type='warning'
          title='Cannot review'
          message='You can only review completed appointments.'
        />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className='max-w-md mx-auto text-center py-16 space-y-4'>
        <p className='text-6xl'>⭐</p>
        <h2 className='text-xl font-bold text-white'>
          Thank you for your review!
        </h2>
        <p className='text-sm' style={{ color: 'rgba(255,255,255,0.55)' }}>
          Your review is pending admin approval and will appear on the doctor's
          profile soon.
        </p>
        <button
          onClick={() => navigate(ROUTES.MY_APPOINTMENTS)}
          className='text-blue-400 hover:text-blue-300 text-sm'
        >
          Back to My Appointments
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-lg'>
      <PageHeader
        title='Write a Review'
        subtitle={`Rate your experience with Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`}
        icon='⭐'
      />

      <div
        className='glass-card rounded-2xl p-4 text-sm'
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <p style={{ color: 'rgba(255,255,255,0.55)' }}>
          Appointment on{' '}
          <strong className='text-white'>{appointment.date}</strong> at{' '}
          <strong className='text-white'>{appointment.time}</strong>
        </p>
      </div>

      <Card>
        <ReviewForm
          appointmentId={appointmentId}
          onSuccess={() => setSubmitted(true)}
        />
      </Card>
    </div>
  )
}
