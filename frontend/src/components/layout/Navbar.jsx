// Navbar.jsx — Top navigation bar with search and notifications
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import useUIStore from '../../store/uiStore.js'
import useNotificationStore from '../../store/notificationStore.js'
import { ROUTES } from '../../constants/routes.js'

export default function Navbar () {
  const { user } = useAuthStore()
  const { toggleSidebar, setPageTitle } = useUIStore()
  const { unreadCount } = useNotificationStore()
  const navigate = useNavigate()

  return (
    <header
      className='sticky top-0 z-30 flex items-center justify-between px-6 py-4'
      style={{
        background: 'rgba(5,11,24,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}
    >
      {/* ── Left: menu toggle + page context ─────────── */}
      <div className='flex items-center gap-4'>
        <button
          onClick={toggleSidebar}
          className='w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all'
        >
          ☰
        </button>
      </div>

      {/* ── Right: search + notifications + user ──────── */}
      <div className='flex items-center gap-3'>
        {/* Search button */}
        <button
          onClick={() => navigate(ROUTES.SEARCH)}
          className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 transition-all'
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <span>🔍</span>
          <span className='hidden md:block'>Search...</span>
        </button>

        {/* Notification bell */}
        <button
          onClick={() => navigate(ROUTES.NOTIFICATIONS)}
          className='relative w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all'
        >
          <span className='text-lg'>🔔</span>
          {unreadCount > 0 && (
            <span
              className='absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-bold text-white px-1'
              style={{ background: '#ef4444', fontSize: '10px' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button
          onClick={() =>
            navigate(
              user?.role === 'patient'
                ? ROUTES.PATIENT_PROFILE
                : ROUTES.DASHBOARD
            )
          }
          className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all'
        >
          <div
            className='w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white'
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
          >
            {user?.initials || 'U'}
          </div>
          <div className='hidden md:block text-left'>
            <p className='text-sm font-medium text-white leading-none'>
              {user?.firstName}
            </p>
            <p
              className='text-xs capitalize mt-0.5'
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {user?.role}
            </p>
          </div>
        </button>
      </div>
    </header>
  )
}
