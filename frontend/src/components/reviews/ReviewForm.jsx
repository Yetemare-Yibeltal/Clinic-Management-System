// ReviewForm.jsx — Patient review submission form
import { useState } from 'react'
import RatingStars from './RatingStars.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../../hooks/useToast.js'
import { reviewService } from '../../services/reviewService.js'

export default function ReviewForm ({ appointmentId, onSuccess }) {
  const { success, error } = useToast()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!rating) {
      error('Please select a rating')
      return
    }

    setIsSubmitting(true)
    try {
      await reviewService.submitReview({
        appointmentId,
        rating,
        comment,
        isAnonymous
      })
      success('Review submitted! It will be visible after admin approval.')
      onSuccess?.()
    } catch (err) {
      error(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div>
        <p
          className='text-sm font-medium mb-2'
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          Your Rating *
        </p>
        <RatingStars value={rating} onChange={setRating} size='lg' />
      </div>

      <div>
        <label
          className='text-sm font-medium mb-1.5 block'
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          Your Review (optional)
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder='Share your experience with this doctor...'
          rows={4}
          maxLength={1000}
          className='w-full text-sm text-white placeholder-white/30 rounded-lg px-4 py-3 outline-none resize-none'
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />
        <p
          className='text-xs mt-1 text-right'
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          {comment.length}/1000
        </p>
      </div>

      <label className='flex items-center gap-3 cursor-pointer'>
        <input
          type='checkbox'
          checked={isAnonymous}
          onChange={e => setIsAnonymous(e.target.checked)}
          className='w-4 h-4 rounded'
        />
        <span className='text-sm' style={{ color: 'rgba(255,255,255,0.65)' }}>
          Submit anonymously
        </span>
      </label>

      <Button
        type='submit'
        variant='primary'
        fullWidth
        isLoading={isSubmitting}
      >
        Submit Review
      </Button>
    </form>
  )
}
