// LoginPage.jsx — Login page for all user roles
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Select from '../components/ui/Select.jsx'
import { ROUTES } from '../constants/routes.js'
import { ROLE_REDIRECTS } from '../constants/roles.js'

export default function LoginPage () {
  const { login, isLoading } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '', role: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const roleOptions = [
    { value: 'patient', label: 'Patient' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'admin', label: 'Admin' }
  ]

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    if (!form.role) errs.role = 'Please select your role'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return

    const result = await login(form)
    if (result.success) {
      success(`Welcome back, ${result.user.firstName}!`)
      const from = location.state?.from?.pathname
      navigate(from || ROLE_REDIRECTS[result.user.role] || ROUTES.DASHBOARD)
    } else {
      error(result.error)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        {/* ── Branding ────────────────────────────── */}
        <div className='text-center mb-8'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4'
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}
          >
            🏥
          </div>
          <h1
            className='text-3xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Kidus Yared
          </h1>
          <p
            className='text-sm mt-1'
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Healthcare Management System
          </p>
        </div>

        {/* ── Login card ───────────────────────────── */}
        <div
          className='rounded-2xl p-8'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <h2
            className='text-xl font-bold text-white mb-6'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Select
              label='Login As'
              name='role'
              value={form.role}
              onChange={handleChange('role')}
              options={roleOptions}
              placeholder='Select your role'
              error={errors.role}
              required
            />

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
              label='Password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              placeholder='Enter your password'
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

            <div className='flex justify-end'>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className='text-sm text-blue-400 hover:text-blue-300 transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type='submit'
              variant='primary'
              fullWidth
              isLoading={isLoading}
              size='lg'
            >
              Sign In
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm' style={{ color: 'rgba(255,255,255,0.45)' }}>
              New patient?{' '}
              <Link
                to={ROUTES.REGISTER}
                className='text-blue-400 hover:text-blue-300 font-medium transition-colors'
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* ── Demo credentials ─────────────────────── */}
        <div
          className='mt-4 p-4 rounded-xl text-center'
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <p
            className='text-xs font-semibold mb-2'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Demo Credentials
          </p>
          <div
            className='space-y-1 text-xs'
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <p>Admin: admin@kidusyared.et / Admin@2025</p>
            <p>Doctor: abebe.bekele@kidusyared.et / Doctor@2025</p>
            <p>Patient: selam.tesfaye@gmail.com / Patient@2025</p>
          </div>
        </div>

        <p
          className='text-center text-xs mt-4'
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          © {new Date().getFullYear()} Kidus Yared Healthcare
        </p>
      </div>
    </div>
  )
}
