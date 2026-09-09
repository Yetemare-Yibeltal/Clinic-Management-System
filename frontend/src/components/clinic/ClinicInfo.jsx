// ClinicInfo.jsx — Clinic information display card
export default function ClinicInfo ({ settings }) {
  if (!settings) return null

  return (
    <div className='glass-card rounded-2xl p-6 space-y-4'>
      <div className='flex items-center gap-4'>
        <div
          className='w-16 h-16 rounded-2xl flex items-center justify-center text-4xl'
          style={{
            background:
              'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2))'
          }}
        >
          🏥
        </div>
        <div>
          <h2
            className='text-xl font-bold text-white'
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {settings.clinicName}
          </h2>
          <p
            className='text-sm mt-0.5'
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {settings.tagline}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
        {[
          { icon: '📧', label: 'Email', value: settings.email },
          { icon: '📞', label: 'Phone', value: settings.phone },
          { icon: '🌐', label: 'Website', value: settings.website },
          {
            icon: '📍',
            label: 'Address',
            value: `${settings.address?.subCity || ''}, ${
              settings.address?.city || 'Addis Ababa'
            }`
          }
        ].map(
          ({ icon, label, value }) =>
            value && (
              <div key={label} className='flex items-start gap-2'>
                <span>{icon}</span>
                <div>
                  <p
                    className='text-xs'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {label}
                  </p>
                  <p className='text-sm text-white mt-0.5'>{value}</p>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  )
}
