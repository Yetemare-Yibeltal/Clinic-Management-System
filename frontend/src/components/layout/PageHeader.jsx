// PageHeader.jsx — Reusable page header with title and actions
export default function PageHeader ({ title, subtitle, actions, icon }) {
  return (
    <div className='flex items-start justify-between mb-6'>
      <div className='flex items-center gap-3'>
        {icon && (
          <div
            className='w-11 h-11 rounded-xl flex items-center justify-center text-xl'
            style={{
              background:
                'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2))',
              border: '1px solid rgba(37,99,235,0.3)'
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <h1
            className='text-2xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className='text-sm mt-0.5'
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className='flex items-center gap-2 flex-shrink-0'>{actions}</div>
      )}
    </div>
  )
}
