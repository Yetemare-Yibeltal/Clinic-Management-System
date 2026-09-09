// MedicalRecordCard.jsx — Single medical record summary card
import { formatDate } from '../../utils/formatters.js'

export default function MedicalRecordCard ({ record, onClick }) {
  return (
    <div
      onClick={() => onClick?.(record)}
      className='glass-card card-hover rounded-2xl p-5 cursor-pointer space-y-3'
    >
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-sm font-semibold text-white'>
            {formatDate(record.visitDate)}
          </p>
          <p
            className='text-xs mt-0.5 capitalize'
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {record.visitType}
          </p>
        </div>
        <div
          className='text-right text-xs'
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <p>
            Dr. {record.doctor?.firstName} {record.doctor?.lastName}
          </p>
          <p>{record.doctor?.specialization}</p>
        </div>
      </div>

      {record.diagnosis && (
        <div
          className='p-3 rounded-xl'
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <p
            className='text-xs font-semibold mb-1'
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Diagnosis
          </p>
          <p className='text-sm text-white'>{record.diagnosis}</p>
        </div>
      )}

      {record.prescriptions?.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {record.prescriptions.slice(0, 3).map((rx, i) => (
            <span
              key={i}
              className='text-xs px-2 py-0.5 rounded-full'
              style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}
            >
              {rx.medicineName}
            </span>
          ))}
          {record.prescriptions.length > 3 && (
            <span
              className='text-xs px-2 py-0.5 rounded-full'
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.4)'
              }}
            >
              +{record.prescriptions.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}
