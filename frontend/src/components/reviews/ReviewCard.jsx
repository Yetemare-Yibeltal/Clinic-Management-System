// ReviewCard.jsx — Single review display card
import RatingStars from './RatingStars.jsx'
import { formatRelativeTime } from '../../utils/formatters.js'

export default function ReviewCard ({ review, showDoctorResponse = true }) {
  return (
    <div className='glass-card rounded-2xl p-5 space-y-3'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div
            className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white'
            style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}
          >
            {review.isAnonymous
              ? 'A'
              : `${review.patient?.firstName?.[0]}${review.patient?.lastName?.[0]}`}
          </div>
          <div>
            <p className='text-sm font-semibold text-white'>
              {review.isAnonymous
                ? 'Anonymous Patient'
                : `${review.patient?.firstName} ${review.patient?.lastName}`}
            </p>
            <p className='text-xs' style={{ color: 'rgba(255,255,255,0.35)' }}>
              {formatRelativeTime(review.createdAt)}
            </p>
          </div>
        </div>
        <RatingStars value={review.rating} readOnly size='sm' />
      </div>

      {review.comment && (
        <p
          className='text-sm leading-relaxed'
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          "{review.comment}"
        </p>
      )}

      {showDoctorResponse && review.doctorResponse && (
        <div className='pl-4 border-l-2 border-blue-500/30 mt-3'>
          <p className='text-xs font-semibold text-blue-400 mb-1'>
            Doctor's Response:
          </p>
          <p className='text-sm' style={{ color: 'rgba(255,255,255,0.55)' }}>
            {review.doctorResponse}
          </p>
        </div>
      )}
    </div>
  )
}
