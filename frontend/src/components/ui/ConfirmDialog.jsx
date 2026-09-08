// ConfirmDialog.jsx — Confirmation dialog for destructive actions
import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmDialog ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  type = 'danger',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}) {
  const icons = { danger: '⚠️', warning: '⚠️', info: 'ℹ️' }
  const confirmVariants = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary'
  }

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size='sm' showClose={false}>
      <div className='text-center py-4'>
        <div className='text-5xl mb-4'>{icons[type]}</div>
        <h3
          className='text-lg font-bold text-white mb-2'
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          {title}
        </h3>
        <p className='text-sm mb-6' style={{ color: 'rgba(255,255,255,0.6)' }}>
          {message}
        </p>
        <div className='flex gap-3 justify-center'>
          <Button variant='secondary' onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariants[type]} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
