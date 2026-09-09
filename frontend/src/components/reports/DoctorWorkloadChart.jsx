// DoctorWorkloadChart.jsx — Top doctors by appointment count
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

export default function DoctorWorkloadChart ({ data = [], isLoading = false }) {
  const chartData = data.map(d => ({
    name: `Dr. ${d.firstName?.charAt(0)}. ${d.lastName}`,
    total: d.totalPatients || 0
  }))

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
        Top Doctors by Patients
      </h3>
      <ResponsiveContainer width='100%' height={200}>
        <BarChart data={chartData} layout='vertical' barSize={16}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='rgba(255,255,255,0.05)'
            horizontal={false}
          />
          <XAxis
            type='number'
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type='category'
            dataKey='name'
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              background: 'rgba(15,23,42,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <Bar dataKey='total' fill='url(#doctorGrad)' radius={[0, 6, 6, 0]} />
          <defs>
            <linearGradient id='doctorGrad' x1='0' y1='0' x2='1' y2='0'>
              <stop offset='0%' stopColor='#1d4ed8' />
              <stop offset='100%' stopColor='#7c3aed' />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
