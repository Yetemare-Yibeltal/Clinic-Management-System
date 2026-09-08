// Pagination.jsx — Page navigation for lists
import Button from './Button.jsx'

export default function Pagination ({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNext,
  onPrev,
  onGoTo,
  total,
  limit
}) {
  if (totalPages <= 1) return null

  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const delta = 2

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      pages.push(i)
    }

    if (pages[0] > 1) {
      if (pages[0] > 2) pages.unshift('...')
      pages.unshift(1)
    }

    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className='flex items-center justify-between mt-4 flex-wrap gap-3'>
      <p className='text-sm' style={{ color: 'rgba(255,255,255,0.45)' }}>
        Showing {startItem}–{endItem} of {total} results
      </p>

      <div className='flex items-center gap-1'>
        <button
          onClick={onPrev}
          disabled={!hasPrevPage}
          className='w-8 h-8 flex items-center justify-center rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-white/10'
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          ‹
        </button>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i}`}
              className='w-8 h-8 flex items-center justify-center text-sm'
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onGoTo?.(p)}
              className='w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all'
              style={
                p === page
                  ? {
                      background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                      color: '#fff'
                    }
                  : {
                      color: 'rgba(255,255,255,0.5)',
                      background: 'transparent'
                    }
              }
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={onNext}
          disabled={!hasNextPage}
          className='w-8 h-8 flex items-center justify-center rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-white/10'
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          ›
        </button>
      </div>
    </div>
  )
}
