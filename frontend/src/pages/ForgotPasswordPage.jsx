// ForgotPasswordPage.jsx — Request password reset email
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../hooks/useToast.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { authService } from '../services/authService.js'
import { ROUTES } from '../constants/routes.js'

export default function ForgotPasswordPage () {
  const { success, error } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email) {
      error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
      success('Password reset email sent! Check your inbox.')
    } catch (err) {
      error(err.response?.data?.error || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4'
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}
          >
            🔐
          </div>
          <h1
            className='text-2xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Forgot Password?
          </h1>
          <p
            className='text-sm mt-1'
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div
          className='rounded-2xl p-8'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {sent ? (
            <div className='text-center space-y-4'>
              <p className='text-5xl'>📧</p>
              <p className='text-base font-semibold text-white'>
                Check your email!
              </p>
              <p
                className='text-sm'
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                We sent a password reset link to{' '}
                <strong className='text-white'>{email}</strong>. The link
                expires in 10 minutes.
              </p>
              <Button
                variant='secondary'
                onClick={() => setSent(false)}
                fullWidth
              >
                Send again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                label='Email Address'
                name='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='your@email.com'
                icon='✉️'
                required
              />
              <Button
                type='submit'
                variant='primary'
                fullWidth
                isLoading={isLoading}
                size='lg'
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className='mt-5 text-center'>
            <Link
              to={ROUTES.LOGIN}
              className='text-sm text-blue-400 hover:text-blue-300 transition-colors'
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
