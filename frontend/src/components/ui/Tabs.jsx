// Tabs.jsx — Tab navigation component
export default function Tabs ({
  tabs = [],
  activeTab,
  onTabChange,
  className = ''
}) {
  return (
    <div
      className={`flex gap-1 p-1 rounded-xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onTabChange?.(tab.value)}
          className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center'
          style={
            activeTab === tab.value
              ? {
                  background:
                    'linear-gradient(135deg,rgba(37,99,235,0.4),rgba(124,58,237,0.4))',
                  color: '#fff',
                  border: '1px solid rgba(37,99,235,0.4)'
                }
              : { color: 'rgba(255,255,255,0.5)', background: 'transparent' }
          }
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className='text-xs px-1.5 py-0.5 rounded-full'
              style={{
                background:
                  activeTab === tab.value
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.08)',
                color:
                  activeTab === tab.value ? '#fff' : 'rgba(255,255,255,0.4)'
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
