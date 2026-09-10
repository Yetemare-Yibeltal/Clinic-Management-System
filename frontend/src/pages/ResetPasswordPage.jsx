// ResetPasswordPage.jsx — Reset password with token from email
import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useToast } from '../hooks/useToast.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { authService } from '../services/authService.js'
import { ROUTES } from '../constants/routes.js'

export default function ResetPasswordPage () {
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (form.newPassword.length < 6)
      errs.newPassword = 'Password must be at least 6 characters'
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!token) {
      error('Invalid or expired reset link')
      return
    }
    if (!validate()) return

    setIsLoading(true)
    try {
      await authService.resetPassword(token, form.newPassword)
      success('Password reset successfully! Please log in.')
      navigate(ROUTES.LOGIN)
    } catch (err) {
      error(
        err.response?.data?.error ||
          'Failed to reset password. Link may have expired.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='text-center'>
          <p className='text-5xl mb-4'>⚠️</p>
          <h2 className='text-xl font-bold text-white mb-2'>
            Invalid Reset Link
          </h2>
          <p
            className='text-sm mb-4'
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            This password reset link is invalid or has expired.
          </p>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className='text-blue-400 hover:text-blue-300'
          >
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4'
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}
          >
            🔑
          </div>
          <h1
            className='text-2xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Reset Password
          </h1>
          <p
            className='text-sm mt-1'
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Enter your new password below
          </p>
        </div>

        <div
          className='rounded-2xl p-8'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='New Password'
              name='newPassword'
              type='password'
              value={form.newPassword}
              onChange={handleChange('newPassword')}
              placeholder='Min 6 characters'
              icon='🔒'
              error={errors.newPassword}
              required
            />
            <Input
              label='Confirm Password'
              name='confirmPassword'
              type='password'
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder='Repeat new password'
              icon='🔒'
              error={errors.confirmPassword}
              required
            />
            <Button
              type='submit'
              variant='primary'
              fullWidth
              isLoading={isLoading}
              size='lg'
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
