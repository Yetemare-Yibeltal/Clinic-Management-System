// DoctorReviews.jsx — Doctor reviews list with rating breakdown
import { useEffect, useState } from 'react'
import { reviewService } from '../../services/reviewService.js'
import {
  formatRelativeTime,
  getRatingStars,
  formatRating
} from '../../utils/formatters.js'
import Spinner from '../ui/Spinner.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function DoctorReviews ({ doctorId }) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load () {
      try {
        const result = await reviewService.getDoctorReviews(doctorId)
        setData(result)
      } finally {
        setIsLoading(false)
      }
    }
    if (doctorId) load()
  }, [doctorId])

  if (isLoading)
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='lg' />
      </div>
    )
  if (!data) return null

  return (
    <div className='space-y-4'>
      {/* ── Summary ──────────────────────────────── */}
      <div className='glass-card rounded-2xl p-6'>
        <div className='flex items-center gap-6'>
          <div className='text-center'>
            <p className='text-5xl font-bold text-white'>
              {formatRating(data.stats?.averageRating)}
            </p>
            <p className='text-yellow-400 text-lg mt-1'>
              {getRatingStars(data.stats?.averageRating)}
            </p>
            <p
              className='text-xs mt-1'
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {data.stats?.totalReviews} reviews
            </p>
          </div>
          <div className='flex-1'>
            {[5, 4, 3, 2, 1].map(star => {
              const count =
                data.ratingBreakdown?.find(r => r._id === star)?.count || 0
              const pct = data.stats?.totalReviews
                ? Math.round((count / data.stats.totalReviews) * 100)
                : 0
              return (
                <div key={star} className='flex items-center gap-2 mb-1.5'>
                  <span
                    className='text-xs w-6 text-right'
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {star}★
                  </span>
                  <div
                    className='flex-1 h-1.5 rounded-full'
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className='h-full rounded-full'
                      style={{ width: `${pct}%`, background: '#fbbf24' }}
                    />
                  </div>
                  <span
                    className='text-xs w-6'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Reviews list ─────────────────────────── */}
      {data.reviews?.length === 0 ? (
        <EmptyState
          icon='💬'
          title='No reviews yet'
          message='Be the first to review this doctor.'
        />
      ) : (
        <div className='space-y-3'>
          {data.reviews.map(review => (
            <div key={review._id} className='glass-card rounded-xl p-4'>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white'
                    style={{
                      background: 'linear-gradient(135deg,#2563eb,#7c3aed)'
                    }}
                  >
                    {review.isAnonymous ? 'A' : review.patient?.initials}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-white'>
                      {review.isAnonymous
                        ? 'Anonymous Patient'
                        : `${review.patient?.firstName} ${review.patient?.lastName}`}
                    </p>
                    <p
                      className='text-xs'
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      {formatRelativeTime(review.createdAt)}
                    </p>
                  </div>
                </div>
                <span className='text-yellow-400 text-sm'>
                  {getRatingStars(review.rating)}
                </span>
              </div>
              {review.comment && (
                <p
                  className='text-sm mt-3 leading-relaxed'
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  "{review.comment}"
                </p>
              )}
              {review.doctorResponse && (
                <div className='mt-3 pl-4 border-l-2 border-blue-500/30'>
                  <p className='text-xs font-semibold text-blue-400 mb-1'>
                    Doctor's Response:
                  </p>
                  <p
                    className='text-sm'
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {review.doctorResponse}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
