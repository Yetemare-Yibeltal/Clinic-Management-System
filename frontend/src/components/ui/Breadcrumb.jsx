// Breadcrumb.jsx — Navigation breadcrumb trail
import { Link } from 'react-router-dom'

export default function Breadcrumb ({ items = [], className = '' }) {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, i) => (
        <div key={i} className='flex items-center gap-2'>
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>}
          {item.href && i < items.length - 1 ? (
            <Link
              to={item.href}
              className='transition-colors hover:text-white'
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={i === items.length - 1 ? 'text-white font-medium' : ''}
              style={
                i < items.length - 1 ? { color: 'rgba(255,255,255,0.45)' } : {}
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
