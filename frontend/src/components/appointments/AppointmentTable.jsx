// AppointmentTable.jsx — Tabular appointment list for manage page
import Table from '../ui/Table.jsx'
import StatusBadge from './StatusBadge.jsx'
import Button from '../ui/Button.jsx'
import { formatETB } from '../../utils/formatters.js'
import useAuthStore from '../../store/authStore.js'

export default function AppointmentTable ({
  appointments = [],
  isLoading = false,
  onConfirm,
  onCancel,
  onComplete,
  selectedIds = [],
  onSelect
}) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const isDoctor = user?.role === 'doctor'

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      render: (_, row) => (
        <div>
          <p className='text-sm font-medium text-white'>
            {row.patient?.firstName} {row.patient?.lastName}
          </p>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
            {row.patient?.phone}
          </p>
        </div>
      )
    },
    {
      key: 'doctor',
      label: 'Doctor',
      render: (_, row) => (
        <div>
          <p className='text-sm text-white'>
            Dr. {row.doctor?.firstName} {row.doctor?.lastName}
          </p>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
            {row.doctor?.specialization}
          </p>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (_, row) => (
        <div>
          <p className='text-sm font-medium text-white'>{row.date}</p>
          <p className='text-xs' style={{ color: '#60a5fa' }}>
            {row.time}
          </p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: val => (
        <span
          className='text-sm capitalize'
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          {val}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: val => <StatusBadge status={val} />
    },
    {
      key: 'fee',
      label: 'Fee',
      render: (val, row) => (
        <div>
          <p className='text-sm font-semibold' style={{ color: '#34d399' }}>
            {formatETB(val)}
          </p>
          <p
            className='text-xs'
            style={{ color: row.isPaid ? '#34d399' : '#fbbf24' }}
          >
            {row.isPaid ? 'Paid' : 'Unpaid'}
          </p>
        </div>
      )
    },
    {
      key: '_id',
      label: 'Actions',
      render: (_, row) => (
        <div className='flex gap-1.5' onClick={e => e.stopPropagation()}>
          {row.status === 'pending' && (isAdmin || isDoctor) && (
            <Button
              size='xs'
              variant='success'
              onClick={() => onConfirm?.(row)}
            >
              Confirm
            </Button>
          )}
          {row.status === 'confirmed' && isDoctor && (
            <Button
              size='xs'
              variant='primary'
              onClick={() => onComplete?.(row)}
            >
              Complete
            </Button>
          )}
          {['pending', 'confirmed'].includes(row.status) && (
            <Button size='xs' variant='danger' onClick={() => onCancel?.(row)}>
              Cancel
            </Button>
          )}
        </div>
      )
    }
  ]

  // Remove patient column for patients, remove doctor column for doctors
  const filteredColumns = columns.filter(col => {
    if (user?.role === 'patient' && col.key === 'patient') return false
    if (user?.role === 'doctor' && col.key === 'doctor') return false
    return true
  })

  return (
    <Table
      columns={filteredColumns}
      data={appointments}
      isLoading={isLoading}
      selectedIds={selectedIds}
      onSelect={isAdmin ? onSelect : undefined}
      emptyTitle='No appointments found'
      emptyMessage='No appointments match your current filters.'
    />
  )
}
