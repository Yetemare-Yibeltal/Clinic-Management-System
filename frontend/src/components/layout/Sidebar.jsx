// Sidebar.jsx — Left navigation sidebar with role-based menu
import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { ROLES } from '../../constants/roles.js'
import useAuthStore from '../../store/authStore.js'
import useUIStore from '../../store/uiStore.js'

// ── Menu item definitions by role ─────────────────────
const MENU_ITEMS = {
  [ROLES.ADMIN]: [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { path: ROUTES.MANAGE_APPOINTMENTS, label: 'Appointments', icon: '📅' },
    { path: ROUTES.DOCTORS, label: 'Doctors', icon: '👨‍⚕️' },
    { path: ROUTES.DEPARTMENTS, label: 'Departments', icon: '🏥' },
    { path: ROUTES.REPORTS, label: 'Reports', icon: '📈' },
    { path: ROUTES.ADMIN_USERS, label: 'Users', icon: '👥' },
    { path: ROUTES.SCHEDULE, label: 'Schedules', icon: '🗓️' },
    { path: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
    { path: ROUTES.ADMIN_SETTINGS, label: 'Settings', icon: '⚙️' }
  ],
  [ROLES.DOCTOR]: [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { path: ROUTES.MANAGE_APPOINTMENTS, label: 'Appointments', icon: '📅' },
    { path: ROUTES.SCHEDULE, label: 'My Schedule', icon: '🗓️' },
    { path: ROUTES.MEDICAL_RECORDS, label: 'Medical Records', icon: '📋' },
    { path: ROUTES.DOCTORS, label: 'Doctors', icon: '👨‍⚕️' },
    { path: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: '🔔' }
  ],
  [ROLES.PATIENT]: [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { path: ROUTES.BOOK_APPOINTMENT, label: 'Book Appointment', icon: '➕' },
    { path: ROUTES.MY_APPOINTMENTS, label: 'My Appointments', icon: '📅' },
    { path: ROUTES.DOCTORS, label: 'Find Doctors', icon: '🔍' },
    { path: ROUTES.MEDICAL_RECORDS, label: 'Medical Records', icon: '📋' },
    { path: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
    { path: ROUTES.PATIENT_PROFILE, label: 'My Profile', icon: '👤' }
  ]
}

export default function Sidebar () {
  const { user, logout } = useAuthStore()
  const { sidebarOpen } = useUIStore()
  const navigate = useNavigate()
  const menuItems = MENU_ITEMS[user?.role] || []

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  if (!sidebarOpen) return null

  return (
    <aside
      className='fixed top-0 left-0 h-full z-40 flex flex-col'
      style={{
        width: '260px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* ── Clinic branding ───────────────────────────── */}
      <div className='p-6 border-b border-white/10'>
        <div className='flex items-center gap-3'>
          <div
            className='w-10 h-10 rounded-xl flex items-center justify-center text-xl'
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}
          >
            🏥
          </div>
          <div>
            <h1
              className='text-sm font-bold text-white leading-tight'
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Kidus Yared
            </h1>
            <p className='text-xs text-white/50'>Healthcare</p>
          </div>
        </div>
      </div>

      {/* ── User info ─────────────────────────────────── */}
      <div className='p-4 border-b border-white/10'>
        <div className='flex items-center gap-3'>
          <div
            className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white'
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
          >
            {user?.initials || 'U'}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-white truncate'>
              {user?.firstName} {user?.lastName}
            </p>
            <p
              className='text-xs capitalize'
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation menu ───────────────────────────── */}
      <nav className='flex-1 overflow-y-auto p-3'>
        <ul className='space-y-1'>
          {menuItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg,rgba(37,99,235,0.3),rgba(124,58,237,0.3))',
                        border: '1px solid rgba(37,99,235,0.3)'
                      }
                    : {}
                }
              >
                <span className='text-base'>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Logout button ─────────────────────────────── */}
      <div className='p-3 border-t border-white/10'>
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/10 transition-all duration-200'
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
