// UnauthorizedPage.jsx — 403 unauthorized access page
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { ROLE_REDIRECTS } from '../constants/roles.js'

export default function UnauthorizedPage () {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ background: '#050b18' }}
    >
      <div className='text-center space-y-6 max-w-md'>
        <p className='text-7xl'>🚫</p>
        <div>
          <h1
            className='text-2xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Access Denied
          </h1>
          <p
            className='text-sm mt-2'
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            You don't have permission to access this page. This area requires a
            different role or higher privileges.
          </p>
        </div>
        <div className='flex gap-3 justify-center'>
          <Button variant='secondary' onClick={() => navigate(-1)}>
            ← Go Back
          </Button>
          <Button
            variant='primary'
            onClick={() => navigate(ROLE_REDIRECTS[user?.role] || '/')}
          >
            🏠 My Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
