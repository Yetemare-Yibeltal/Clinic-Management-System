// PatientTrendChart.jsx — Patient registration trend chart
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

export default function PatientTrendChart ({ data = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className='glass-card rounded-2xl p-5'>
        <div className='h-48 animate-pulse flex items-center justify-center'>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='glass-card rounded-2xl p-5'>
      <h3
        className='text-sm font-semibold text-white mb-4'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        Patient Registrations by City
      </h3>
      {data.length === 0 ? (
        <p
          className='text-center py-8 text-sm'
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          No data available
        </p>
      ) : (
        <div className='space-y-2'>
          {data.slice(0, 8).map((item, i) => {
            const maxCount = Math.max(...data.map(d => d.count))
            const pct = Math.round((item.count / maxCount) * 100)
            return (
              <div key={i} className='flex items-center gap-3'>
                <span
                  className='text-xs w-24 truncate'
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  {item._id || 'Unknown'}
                </span>
                <div
                  className='flex-1 h-2 rounded-full'
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className='h-full rounded-full transition-all'
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg,#1d4ed8,#7c3aed)'
                    }}
                  />
                </div>
                <span className='text-xs w-6 text-right font-medium text-white'>
                  {item.count}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
