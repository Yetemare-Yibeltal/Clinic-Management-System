// RatingStars.jsx — Interactive star rating input
export default function RatingStars({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const sizes = { sm: 'text-base', md: 'text-2xl', lg: 'text-4xl' }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange?.(star)}
          disabled={readOnly}
          className={`transition-all duration-150 ${sizes[size]} ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          style={{ color: star <= value ? '#fbbf24' : 'rgba(255,255,255,0.15)' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}