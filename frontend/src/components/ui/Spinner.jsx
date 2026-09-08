// Spinner.jsx — Loading spinner component
export default function Spinner ({ size = 'md', color = 'blue' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  }

  const colors = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    white: 'border-white',
    green: 'border-green-500'
  }

  return (
    <div
      className={`${sizes[size]} rounded-full animate-spin`}
      style={{
        borderColor: 'rgba(255,255,255,0.1)',
        borderTopColor:
          color === 'blue'
            ? '#3b82f6'
            : color === 'purple'
            ? '#8b5cf6'
            : color === 'green'
            ? '#10b981'
            : '#ffffff'
      }}
    />
  )
}
