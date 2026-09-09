// PrescriptionList.jsx — Prescription list display and editor
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'

export default function PrescriptionList ({
  prescriptions = [],
  onChange,
  readOnly = false
}) {
  const addRow = () => {
    onChange?.([
      ...prescriptions,
      {
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }
    ])
  }

  const updateRow = (index, field, value) => {
    const updated = prescriptions.map((rx, i) =>
      i === index ? { ...rx, [field]: value } : rx
    )
    onChange?.(updated)
  }

  const removeRow = index => {
    onChange?.(prescriptions.filter((_, i) => i !== index))
  }

  if (readOnly) {
    return prescriptions.length === 0 ? (
      <p className='text-sm' style={{ color: 'rgba(255,255,255,0.4)' }}>
        No prescriptions
      </p>
    ) : (
      <div className='space-y-2'>
        {prescriptions.map((rx, i) => (
          <div
            key={i}
            className='p-3 rounded-xl'
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <p className='text-sm font-semibold text-white'>
              {rx.medicineName}
            </p>
            <p
              className='text-xs mt-1'
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {rx.dosage} · {rx.frequency} · {rx.duration}
            </p>
            {rx.instructions && (
              <p
                className='text-xs mt-0.5'
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {rx.instructions}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {prescriptions.map((rx, index) => (
        <div
          key={index}
          className='p-4 rounded-xl space-y-3'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div className='flex items-center justify-between'>
            <p
              className='text-xs font-semibold'
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Prescription {index + 1}
            </p>
            <button
              onClick={() => removeRow(index)}
              className='text-red-400 hover:text-red-300 text-xs'
            >
              Remove
            </button>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            <Input
              label='Medicine'
              value={rx.medicineName}
              onChange={e => updateRow(index, 'medicineName', e.target.value)}
              placeholder='e.g. Amoxicillin'
              className='col-span-2 sm:col-span-1'
            />
            <Input
              label='Dosage'
              value={rx.dosage}
              onChange={e => updateRow(index, 'dosage', e.target.value)}
              placeholder='e.g. 500mg'
            />
            <Input
              label='Frequency'
              value={rx.frequency}
              onChange={e => updateRow(index, 'frequency', e.target.value)}
              placeholder='e.g. 3x daily'
            />
            <Input
              label='Duration'
              value={rx.duration}
              onChange={e => updateRow(index, 'duration', e.target.value)}
              placeholder='e.g. 7 days'
            />
            <Input
              label='Instructions'
              value={rx.instructions}
              onChange={e => updateRow(index, 'instructions', e.target.value)}
              placeholder='e.g. After food'
              className='col-span-2'
            />
          </div>
        </div>
      ))}
      <Button size='sm' variant='secondary' onClick={addRow} icon='➕'>
        Add Prescription
      </Button>
    </div>
  )
}
