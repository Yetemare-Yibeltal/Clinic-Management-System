// MyAppointmentsPage.jsx — Patient's own appointment list
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import AppointmentCard from '../components/appointments/AppointmentCard.jsx'
import AppointmentFilter from '../components/appointments/AppointmentFilter.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Modal from '../components/ui/Modal.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useNavigate } from 'react-router-dom'
import useAppointmentStore from '../store/appointmentStore.js'
import { useToast } from '../hooks/useToast.js'

export default function MyAppointmentsPage () {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const {
    appointments,
    isLoading,
    filters,
    setFilters,
    fetchAppointments,
    cancelAppointment
  } = useAppointmentStore()

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    appointment: null
  })
  const [cancelNote, setCancelNote] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])
  useEffect(() => {
    fetchAppointments()
  }, [filters])

  const handleCancel = async () => {
    setIsCancelling(true)
    const result = await cancelAppointment(
      cancelModal.appointment._id,
      cancelNote
    )
    if (result.success) {
      success('Appointment cancelled successfully.')
      setCancelModal({ isOpen: false, appointment: null })
      setCancelNote('')
    } else {
      error(result.error)
    }
    setIsCancelling(false)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='My Appointments'
        subtitle={`${appointments.length} total appointments`}
        icon='📅'
        actions={
          <Button
            variant='primary'
            size='sm'
            onClick={() => navigate('/book-appointment')}
          >
            ➕ Book New
          </Button>
        }
      />

      <AppointmentFilter
        filters={filters}
        onFilterChange={c => setFilters(c)}
      />

      {isLoading ? (
        <div className='flex justify-center py-16'>
          <Spinner size='lg' />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon='📅'
          title='No appointments found'
          message='Book your first appointment with one of our doctors.'
          actionLabel='Book Appointment'
          onAction={() => navigate('/book-appointment')}
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {appointments.map(apt => (
            <AppointmentCard
              key={apt._id}
              appointment={apt}
              onCancel={a => setCancelModal({ isOpen: true, appointment: a })}
            />
          ))}
        </div>
      )}

      {/* ── Cancel modal ─────────────────────────── */}
      <Modal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, appointment: null })}
        title='Cancel Appointment'
        footer={
          <>
            <Button
              variant='secondary'
              onClick={() =>
                setCancelModal({ isOpen: false, appointment: null })
              }
            >
              Keep Appointment
            </Button>
            <Button
              variant='danger'
              isLoading={isCancelling}
              onClick={handleCancel}
            >
              Cancel Appointment
            </Button>
          </>
        }
      >
        <p className='text-sm mb-4' style={{ color: 'rgba(255,255,255,0.6)' }}>
          Are you sure you want to cancel your appointment on{' '}
          <strong className='text-white'>
            {cancelModal.appointment?.date}
          </strong>{' '}
          at{' '}
          <strong className='text-white'>
            {cancelModal.appointment?.time}
          </strong>
          ?
        </p>
        <Input
          label='Reason for cancellation (optional)'
          name='cancelNote'
          value={cancelNote}
          onChange={e => setCancelNote(e.target.value)}
          placeholder='e.g. Schedule conflict'
        />
      </Modal>
    </div>
  )
}
