// AppointmentChart.jsx — Appointment status pie/bar chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { APPOINTMENT_STATUS_LABELS } from '../../constants/status.js'

const STATUS_COLORS = {
  pending: '#fbbf24',
  confirmed: '#60a5fa',
  cancelled: '#f87171',
  completed: '#34d399',
  rescheduled: '#a78bfa'
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className='px-3 py-2 rounded-lg text-sm'
      style={{
        background: 'rgba(15,23,42,0.95)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <p className='text-white font-medium'>
        {APPOINTMENT_STATUS_LABELS[payload[0]?.payload?._id] ||
          payload[0]?.payload?._id}
      </p>
      <p style={{ color: payload[0]?.fill }}>Count: {payload[0]?.value}</p>
    </div>
  )
}

export default function AppointmentChart ({ data = [], isLoading = false }) {
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
        Appointments by Status
      </h3>
      <ResponsiveContainer width='100%' height={200}>
        <BarChart data={data} barSize={32}>
          <XAxis
            dataKey='_id'
            tickFormatter={v => APPOINTMENT_STATUS_LABELS[v] || v}
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
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
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey='count' radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLORS[entry._id] || '#60a5fa'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
