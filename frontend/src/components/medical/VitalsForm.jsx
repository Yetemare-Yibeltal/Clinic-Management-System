// VitalsForm.jsx — Vitals input form for medical records
import Input from '../ui/Input.jsx'

export default function VitalsForm ({ values = {}, onChange }) {
  const handleChange = field => e => onChange?.(field, e.target.value)

  const fields = [
    {
      key: 'bloodPressure',
      label: 'Blood Pressure',
      placeholder: '120/80',
      unit: 'mmHg'
    },
    { key: 'heartRate', label: 'Heart Rate', placeholder: '72', unit: 'bpm' },
    {
      key: 'temperature',
      label: 'Temperature',
      placeholder: '36.6',
      unit: '°C'
    },
    { key: 'weight', label: 'Weight', placeholder: '70', unit: 'kg' },
    { key: 'height', label: 'Height', placeholder: '170', unit: 'cm' },
    {
      key: 'oxygenSaturation',
      label: 'Oxygen Saturation',
      placeholder: '98',
      unit: '%'
    },
    {
      key: 'respiratoryRate',
      label: 'Respiratory Rate',
      placeholder: '16',
      unit: '/min'
    },
    {
      key: 'bloodSugar',
      label: 'Blood Sugar',
      placeholder: '90',
      unit: 'mg/dL'
    }
  ]

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
      {fields.map(({ key, label, placeholder, unit }) => (
        <div key={key}>
          <Input
            label={`${label} (${unit})`}
            name={key}
            type='number'
            value={values[key] || ''}
            onChange={handleChange(key)}
            placeholder={placeholder}
          />
        </div>
      ))}
    </div>
  )
}
