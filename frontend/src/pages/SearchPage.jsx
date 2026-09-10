// SearchPage.jsx — Global search page
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import SearchResults from '../components/search/SearchResults.jsx'
import SearchFilters from '../components/search/SearchFilters.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useSearch } from '../hooks/useSearch.js'

export default function SearchPage () {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const {
    inputValue,
    results,
    isLoading,
    hasSearched,
    handleInputChange,
    handleClear
  } = useSearch()

  useEffect(() => {
    if (q) handleInputChange(q)
  }, [])

  return (
    <div className='space-y-6 max-w-3xl'>
      <PageHeader
        title='Search'
        subtitle='Find doctors, patients, and appointments'
        icon='🔍'
      />

      {/* ── Search input ─────────────────────────── */}
      <div className='relative'>
        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-white/40'>
          🔍
        </span>
        <input
          type='text'
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          placeholder='Search doctors, patients, appointments...'
          className='w-full text-white placeholder-white/30 rounded-2xl pl-11 pr-4 py-4 text-base outline-none transition-all'
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
          autoFocus
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80'
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Results ──────────────────────────────── */}
      {isLoading ? (
        <div className='flex justify-center py-16'>
          <Spinner size='lg' />
        </div>
      ) : hasSearched ? (
        <SearchResults results={results} query={inputValue} />
      ) : (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>🔍</p>
          <p className='text-base font-semibold text-white'>
            Start typing to search
          </p>
          <p
            className='text-sm mt-1'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Search for doctors by name or specialization
          </p>
        </div>
      )}
    </div>
  )
}
