// NotFoundPage.jsx — 404 error page
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function NotFoundPage () {
  const navigate = useNavigate()

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ background: '#050b18' }}
    >
      <div className='text-center space-y-6'>
        <div>
          <p
            className='text-8xl font-bold'
            style={{
              fontFamily: 'Syne, sans-serif',
              background: 'linear-gradient(135deg,#60a5fa,#a78bfa,#f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            404
          </p>
          <p
            className='text-2xl font-bold text-white mt-2'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Page Not Found
          </p>
          <p
            className='text-sm mt-2'
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className='flex gap-3 justify-center'>
          <Button variant='secondary' onClick={() => navigate(-1)}>
            ← Go Back
          </Button>
          <Button variant='primary' onClick={() => navigate('/')}>
            🏠 Home
          </Button>
        </div>
      </div>
    </div>
  )
}
