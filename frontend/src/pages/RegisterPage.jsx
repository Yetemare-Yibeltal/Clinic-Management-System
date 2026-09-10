// RegisterPage.jsx — Patient registration page
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { ROUTES } from '../constants/routes.js'
import { getPasswordStrength } from '../utils/validators.js'

export default function RegisterPage () {
  const { register, isLoading } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const strength = getPasswordStrength(form.password)

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email) errs.email = 'Email is required'
    if (!form.phone) errs.phone = 'Phone number is required'
    if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return

    const { confirmPassword, ...data } = form
    const result = await register(data)

    if (result.success) {
      success(
        'Account created successfully! Welcome to Kidus Yared Healthcare.'
      )
      navigate(ROUTES.DASHBOARD)
    } else {
      error(result.error)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        {/* ── Branding ────────────────────────────── */}
        <div className='text-center mb-6'>
          <div
            className='w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3'
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}
          >
            🏥
          </div>
          <h1
            className='text-2xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Create Account
          </h1>
          <p
            className='text-sm mt-1'
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Join Kidus Yared Healthcare
          </p>
        </div>

        {/* ── Register card ───────────────────────── */}
        <div
          className='rounded-2xl p-6'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <Input
                label='First Name'
                name='firstName'
                value={form.firstName}
                onChange={handleChange('firstName')}
                placeholder='Selam'
                error={errors.firstName}
                required
              />
              <Input
                label='Last Name'
                name='lastName'
                value={form.lastName}
                onChange={handleChange('lastName')}
                placeholder='Tesfaye'
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label='Email Address'
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange('email')}
              placeholder='you@example.com'
              icon='✉️'
              error={errors.email}
              required
            />

            <Input
              label='Phone Number'
              name='phone'
              type='tel'
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder='+251911223344'
              icon='📞'
              error={errors.phone}
              required
              hint='Ethiopian phone number'
            />

            <div>
              <Input
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder='Min 6 characters'
                icon='🔒'
                error={errors.password}
                required
                rightIcon={
                  <button
                    type='button'
                    onClick={() => setShowPassword(v => !v)}
                    className='text-white/40 hover:text-white/70 transition-colors text-sm'
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                }
              />
              {form.password && (
                <div className='mt-2 flex items-center gap-2'>
                  <div className='flex gap-1 flex-1'>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className='flex-1 h-1 rounded-full transition-all'
                        style={{
                          background:
                            i <= strength.score
                              ? strength.color.replace('bg-', '') === 'red-500'
                                ? '#ef4444'
                                : strength.color.replace('bg-', '') ===
                                  'green-500'
                                ? '#10b981'
                                : strength.color.replace('bg-', '') ===
                                  'blue-500'
                                ? '#3b82f6'
                                : '#f59e0b'
                              : 'rgba(255,255,255,0.1)'
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span
                      className='text-xs'
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            <Input
              label='Confirm Password'
              name='confirmPassword'
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder='Repeat password'
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
              Create Account
            </Button>
          </form>

          <div className='mt-5 text-center'>
            <p className='text-sm' style={{ color: 'rgba(255,255,255,0.45)' }}>
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className='text-blue-400 hover:text-blue-300 font-medium transition-colors'
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
