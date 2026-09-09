// SlotCell.jsx — Single slot cell in the weekly schedule grid
export default function SlotCell ({ status, onClick, readOnly = false }) {
  const styles = {
    avail: {
      background: 'rgba(5,150,105,0.3)',
      border: '1px solid rgba(5,150,105,0.5)',
      cursor: readOnly ? 'default' : 'pointer'
    },
    booked: {
      background: 'rgba(37,99,235,0.3)',
      border: '1px solid rgba(37,99,235,0.5)',
      cursor: 'not-allowed'
    },
    break: {
      background: 'rgba(217,119,6,0.3)',
      border: '1px solid rgba(217,119,6,0.5)',
      cursor: readOnly ? 'default' : 'pointer'
    },
    closed: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      cursor: readOnly ? 'default' : 'pointer'
    }
  }

  const icons = { avail: '', booked: '🔒', break: '☕', closed: '' }

  return (
    <div
      onClick={status !== 'booked' ? onClick : undefined}
      className='w-9 h-9 rounded-lg flex items-center justify-center text-xs mx-auto transition-all duration-150'
      style={styles[status] || styles.closed}
      title={status}
    >
      {icons[status]}
    </div>
  )
}
