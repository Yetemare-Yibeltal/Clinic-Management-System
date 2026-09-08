// Card.jsx — Glassmorphism card container
export default function Card ({
  children,
  className = '',
  padding = 'p-6',
  hover = false,
  onClick = null
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl ${padding} ${
        hover ? 'card-hover' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
