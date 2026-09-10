// ManageAppointmentsPage.jsx — Admin/Doctor appointment management
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import AppointmentTable from '../components/appointments/AppointmentTable.jsx'
import AppointmentFilter from '../components/appointments/AppointmentFilter.jsx'
import AppointmentActions from '../components/appointments/AppointmentActions.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import useAppointmentStore from '../store/appointmentStore.js'
import { useToast } from '../hooks/useToast.js'
import { usePagination } from '../hooks/usePagination.js'

export default function ManageAppointmentsPage () {
  const { success, error } = useToast()
  const {
    appointments,
    isLoading,
    isUpdating,
    filters,
    setFilters,
    fetchAppointments,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    bulkUpdateStatus
  } = useAppointmentStore()

  const {
    page,
    limit,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    total,
    setTotalItems
  } = usePagination()
  const [selectedIds, setSelectedIds] = useState([])
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    appointment: null
  })
  const [cancelNote, setCancelNote] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const statusTabs = [
    { value: 'all', label: 'All', icon: '📋' },
    { value: 'pending', label: 'Pending', icon: '⏳' },
    { value: 'confirmed', label: 'Confirmed', icon: '✅' },
    { value: 'completed', label: 'Completed', icon: '🎉' },
    { value: 'cancelled', label: 'Cancelled', icon: '❌' }
  ]

  useEffect(() => {
    fetchAppointments({ page, limit, status: activeTab })
  }, [page, limit, activeTab, filters])

  const handleConfirm = async apt => {
    const result = await confirmAppointment(apt._id)
    result.success ? success('Appointment confirmed.') : error(result.error)
  }

  const handleComplete = async apt => {
    const result = await completeAppointment(apt._id)
    result.success
      ? success('Appointment marked as completed.')
      : error(result.error)
  }

  const handleCancel = async () => {
    const result = await cancelAppointment(
      cancelModal.appointment._id,
      cancelNote
    )
    if (result.success) {
      success('Appointment cancelled.')
      setCancelModal({ isOpen: false, appointment: null })
      setCancelNote('')
    } else {
      error(result.error)
    }
  }

  const handleBulkConfirm = async () => {
    const result = await bulkUpdateStatus(selectedIds, 'confirmed')
    result.success
      ? success(`${selectedIds.length} appointments confirmed.`)
      : error(result.error)
    setSelectedIds([])
  }

  const handleBulkCancel = async () => {
    const result = await bulkUpdateStatus(selectedIds, 'cancelled')
    result.success
      ? success(`${selectedIds.length} appointments cancelled.`)
      : error(result.error)
    setSelectedIds([])
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Manage Appointments'
        subtitle={`${appointments.length} appointments`}
        icon='📅'
      />

      <Tabs
        tabs={statusTabs}
        activeTab={activeTab}
        onTabChange={t => {
          setActiveTab(t)
          setFilters({ status: t })
        }}
      />

      <AppointmentFilter
        filters={filters}
        onFilterChange={c => setFilters(c)}
      />

      {selectedIds.length > 0 && (
        <AppointmentActions
          selectedIds={selectedIds}
          onBulkConfirm={handleBulkConfirm}
          onBulkCancel={handleBulkCancel}
          isLoading={isUpdating}
        />
      )}

      <AppointmentTable
        appointments={appointments}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={apt => setCancelModal({ isOpen: true, appointment: apt })}
        onComplete={handleComplete}
        selectedIds={selectedIds}
        onSelect={setSelectedIds}
      />

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
              Back
            </Button>
            <Button
              variant='danger'
              isLoading={isUpdating}
              onClick={handleCancel}
            >
              Cancel Appointment
            </Button>
          </>
        }
      >
        <Input
          label='Cancellation reason'
          value={cancelNote}
          onChange={e => setCancelNote(e.target.value)}
          placeholder='Reason for cancellation...'
        />
      </Modal>
    </div>
  )
}
