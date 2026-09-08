// Button.jsx — Reusable button with variants and loading state
import Spinner from './Spinner.jsx'

export default function Button ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  icon = null,
  className = ''
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'text-white hover:opacity-90 active:scale-95',
    secondary:
      'text-white/80 hover:text-white hover:bg-white/10 active:scale-95',
    danger: 'text-white hover:opacity-90 active:scale-95',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5 active:scale-95',
    success: 'text-white hover:opacity-90 active:scale-95',
    outline: 'text-white/70 hover:text-white hover:bg-white/5 active:scale-95'
  }

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
      border: 'none'
    },
    secondary: {
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)'
    },
    danger: {
      background: 'linear-gradient(135deg,#dc2626,#9f1239)',
      border: 'none'
    },
    ghost: { background: 'transparent', border: 'none' },
    success: {
      background: 'linear-gradient(135deg,#059669,#0d9488)',
      border: 'none'
    },
    outline: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.2)'
    }
  }

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      style={variantStyles[variant]}
    >
      {isLoading ? (
        <Spinner size='sm' color='white' />
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
