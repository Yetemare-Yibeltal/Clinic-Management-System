// PaymentMethodCard.jsx — Single payment method selection card
export default function PaymentMethodCard ({ method, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(method.id)}
      className='w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200'
      style={
        isSelected
          ? {
              background: 'rgba(37,99,235,0.2)',
              border: '2px solid rgba(37,99,235,0.5)'
            }
          : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)'
            }
      }
    >
      <span className='text-3xl'>{method.icon}</span>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold text-white'>{method.label}</p>
        <p
          className='text-xs mt-0.5 truncate'
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {method.description}
        </p>
      </div>
      <div
        className='w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all'
        style={{
          borderColor: isSelected ? '#2563eb' : 'rgba(255,255,255,0.2)',
          background: isSelected ? '#2563eb' : 'transparent'
        }}
      >
        {isSelected && <span className='text-white text-xs'>✓</span>}
      </div>
    </button>
  )
}
