// WorkloadChart.jsx — Appointment workload bar chart for dashboard
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className='px-3 py-2 rounded-lg text-sm'
      style={{
        background: 'rgba(15,23,42,0.95)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <p className='text-white font-medium'>{label}</p>
      <p style={{ color: '#60a5fa' }}>Appointments: {payload[0]?.value}</p>
    </div>
  )
}

export default function WorkloadChart ({ data = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className='glass-card rounded-2xl p-5'>
        <div className='h-48 flex items-center justify-center'>
          <div className='animate-pulse text-white/20'>Loading chart...</div>
        </div>
      </div>
    )
  }

  const chartData = data.map(item => ({
    name: item.month || item._id || item.day,
    value: item.revenue || item.count || 0
  }))

  return (
    <div className='glass-card rounded-2xl p-5'>
      <h3
        className='text-sm font-semibold text-white mb-4'
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        Monthly Overview
      </h3>
      <ResponsiveContainer width='100%' height={180}>
        <BarChart data={chartData} barSize={24}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='rgba(255,255,255,0.05)'
            vertical={false}
          />
          <XAxis
            dataKey='name'
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          <Bar dataKey='value' fill='url(#barGrad)' radius={[6, 6, 0, 0]} />
          <defs>
            <linearGradient id='barGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#2563eb' />
              <stop offset='100%' stopColor='#7c3aed' />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
