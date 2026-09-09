// AppointmentActions.jsx — Bulk action toolbar for appointments
import Button from '../ui/Button.jsx'

export default function AppointmentActions ({
  selectedIds = [],
  onBulkConfirm,
  onBulkCancel,
  isLoading
}) {
  if (selectedIds.length === 0) return null

  return (
    <div
      className='flex items-center gap-3 px-4 py-3 rounded-xl'
      style={{
        background: 'rgba(37,99,235,0.12)',
        border: '1px solid rgba(37,99,235,0.25)'
      }}
    >
      <span className='text-sm font-medium text-white'>
        {selectedIds.length} appointment{selectedIds.length > 1 ? 's' : ''}{' '}
        selected
      </span>
      <div className='flex gap-2 ml-auto'>
        <Button
          size='sm'
          variant='success'
          isLoading={isLoading}
          onClick={onBulkConfirm}
        >
          Confirm All
        </Button>
        <Button
          size='sm'
          variant='danger'
          isLoading={isLoading}
          onClick={onBulkCancel}
        >
          Cancel All
        </Button>
      </div>
    </div>
  )
}
