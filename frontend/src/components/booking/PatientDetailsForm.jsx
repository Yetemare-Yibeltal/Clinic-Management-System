// PatientDetailsForm.jsx — Step 3 of booking: visit details
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import {
  APPOINTMENT_TYPES,
  VISIT_MODES,
  PRIORITY_LEVELS
} from '../../constants/status.js'

export default function PatientDetailsForm ({ values, onChange, errors = {} }) {
  const handleChange = field => e => onChange(field, e.target.value)

  return (
    <div className='space-y-4'>
      <Select
        label='Appointment Type'
        name='type'
        value={values.type}
        onChange={handleChange('type')}
        options={APPOINTMENT_TYPES}
        error={errors.type}
        required
      />
      <Select
        label='Visit Mode'
        name='visitMode'
        value={values.visitMode}
        onChange={handleChange('visitMode')}
        options={VISIT_MODES}
        error={errors.visitMode}
        required
      />
      <Select
        label='Priority'
        name='priority'
        value={values.priority}
        onChange={handleChange('priority')}
        options={PRIORITY_LEVELS}
        error={errors.priority}
      />
      <div>
        <label
          className='text-sm font-medium mb-1.5 block'
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          Symptoms / Reason for Visit
        </label>
        <textarea
          value={values.symptoms}
          onChange={handleChange('symptoms')}
          placeholder='Describe your symptoms or reason for the appointment...'
          rows={4}
          className='w-full text-sm text-white placeholder-white/30 rounded-lg px-4 py-3 outline-none resize-none transition-all'
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />
      </div>
    </div>
  )
}
