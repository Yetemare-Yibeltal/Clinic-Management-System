// LabTestList.jsx — Lab test list display for medical records
import Badge from '../ui/Badge.jsx'

export default function LabTestList ({ labTests = [], readOnly = true }) {
  if (labTests.length === 0) {
    return (
      <p className='text-sm' style={{ color: 'rgba(255,255,255,0.4)' }}>
        No lab tests ordered
      </p>
    )
  }

  const statusVariant = {
    ordered: 'yellow',
    completed: 'green',
    pending: 'blue'
  }

  return (
    <div className='space-y-2'>
      {labTests.map((test, i) => (
        <div
          key={i}
          className='flex items-center justify-between p-3 rounded-xl'
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div>
            <p className='text-sm font-medium text-white'>{test.testName}</p>
            {test.reason && (
              <p
                className='text-xs mt-0.5'
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {test.reason}
              </p>
            )}
            {test.result && (
              <p
                className='text-xs mt-1 font-medium'
                style={{ color: '#60a5fa' }}
              >
                Result: {test.result}
              </p>
            )}
          </div>
          <Badge variant={statusVariant[test.status] || 'default'} size='sm'>
            {test.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}
