// AuthLayout.jsx — Layout wrapper for login and register pages
import { Outlet, Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import { ROUTES } from '../../constants/routes.js'

export default function AuthLayout () {
  const { isLoggedIn } = useAuthStore()

  // Redirect to dashboard if already logged in
  if (isLoggedIn) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div
      className='min-h-screen relative overflow-hidden flex items-center justify-center'
      style={{ background: '#050b18' }}
    >
      {/* ── Animated background orbs ─────────────────── */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute animate-orbpulse'
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
            top: '-200px',
            left: '-200px'
          }}
        />
        <div
          className='absolute animate-orbpulse'
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            bottom: '-150px',
            right: '-150px',
            animationDelay: '2s'
          }}
        />
        <div
          className='absolute animate-orbpulse'
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)',
            top: '40%',
            right: '20%',
            animationDelay: '4s'
          }}
        />
      </div>

      {/* ── Grid pattern overlay ──────────────────────── */}
      <div
        className='absolute inset-0 opacity-5 pointer-events-none'
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* ── Page content ─────────────────────────────── */}
      <div className='relative z-10 w-full'>
        <Outlet />
      </div>
    </div>
  )
}
