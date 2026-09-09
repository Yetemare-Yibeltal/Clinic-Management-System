// RevenueChart.jsx — Monthly revenue line chart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

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
      <p className='text-white font-medium'>{MONTHS[(label || 1) - 1]}</p>
      <p style={{ color: '#34d399' }}>
        Revenue: {payload[0]?.value?.toLocaleString()} ETB
      </p>
      <p style={{ color: '#60a5fa' }}>Payments: {payload[1]?.value}</p>
    </div>
  )
}

export default function RevenueChart ({ data = [], isLoading = false }) {
  const chartData = data.map(item => ({
    month: item.month,
    revenue: item.revenue || 0,
    count: item.count || 0
  }))

  if (isLoading) {
    return (
      <div className='glass-card rounded-2xl p-5'>
        <div className='h-64 flex items-center justify-center animate-pulse'>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>
            Loading chart...
          </span>
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
        Monthly Revenue
      </h3>
      <ResponsiveContainer width='100%' height={240}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='rgba(255,255,255,0.05)'
          />
          <XAxis
            dataKey='month'
            tickFormatter={v => MONTHS[(v || 1) - 1]}
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type='monotone'
            dataKey='revenue'
            stroke='#34d399'
            strokeWidth={2}
            dot={{ fill: '#34d399', r: 4 }}
          />
          <Line
            type='monotone'
            dataKey='count'
            stroke='#60a5fa'
            strokeWidth={2}
            dot={{ fill: '#60a5fa', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
