// PatientProfilePage.jsx — Patient views and edits their own profile
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import PageHeader from '../components/layout/PageHeader.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import FileUpload from '../components/ui/FileUpload.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import { patientService } from '../services/patientService.js'
import { uploadService } from '../services/uploadService.js'
import { getImageUrl } from '../utils/imageUtils.js'

export default function PatientProfilePage () {
  const { user, updateUser } = useAuth()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    subCity: user?.subCity || '',
    woreda: user?.woreda || '',
    dateOfBirth: user?.dateOfBirth?.split('T')[0] || '',
    gender: user?.gender || '',
    bloodType: user?.bloodType || '',
    allergies: user?.allergies || '',
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      phone: user?.emergencyContact?.phone || '',
      relationship: user?.emergencyContact?.relationship || ''
    }
  })

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [pwErrors, setPwErrors] = useState({})

  const handleChange = field => e =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  const handleEmergencyChange = field => e =>
    setForm(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: e.target.value }
    }))

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const updated = await patientService.updateMyProfile(form)
      updateUser(updated.patient)
      success('Profile updated successfully!')
    } catch (err) {
      error(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async file => {
    try {
      const result = await uploadService.uploadAvatar(file)
      updateUser({ avatar: result.avatar })
      success('Avatar updated!')
    } catch (err) {
      error('Failed to upload avatar')
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    const errs = {}
    if (!pwForm.currentPassword) errs.currentPassword = 'Required'
    if (pwForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters'
    if (pwForm.newPassword !== pwForm.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'
    setPwErrors(errs)
    if (Object.keys(errs).length) return

    setIsSaving(true)
    try {
      await patientService.changePassword(
        pwForm.currentPassword,
        pwForm.newPassword
      )
      success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { value: 'profile', label: 'Profile', icon: '👤' },
    { value: 'security', label: 'Security', icon: '🔒' }
  ]

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ]

  const bloodTypeOptions = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
  ].map(v => ({ value: v, label: v }))

  return (
    <div className='space-y-6 max-w-2xl'>
      <PageHeader
        title='My Profile'
        subtitle='Manage your personal information'
        icon='👤'
      />

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'profile' && (
        <div className='space-y-5'>
          {/* ── Avatar ──────────────────────────── */}
          <Card>
            <div className='flex items-center gap-5'>
              {user?.avatar ? (
                <img
                  src={getImageUrl(user.avatar)}
                  alt='Avatar'
                  className='w-20 h-20 rounded-2xl object-cover'
                />
              ) : (
                <div
                  className='w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white'
                  style={{
                    background: 'linear-gradient(135deg,#2563eb,#7c3aed)'
                  }}
                >
                  {user?.initials}
                </div>
              )}
              <FileUpload
                label=''
                hint='JPG, PNG or WEBP up to 5MB'
                onFileSelect={handleAvatarUpload}
                className='flex-1'
              />
            </div>
          </Card>

          {/* ── Personal info ────────────────────── */}
          <Card>
            <h3 className='text-sm font-semibold text-white mb-4'>
              Personal Information
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='First Name'
                value={form.firstName}
                onChange={handleChange('firstName')}
              />
              <Input
                label='Last Name'
                value={form.lastName}
                onChange={handleChange('lastName')}
              />
              <Input
                label='Phone'
                value={form.phone}
                onChange={handleChange('phone')}
                type='tel'
                className='col-span-2'
              />
              <Input
                label='Date of Birth'
                value={form.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                type='date'
              />
              <Select
                label='Gender'
                value={form.gender}
                onChange={handleChange('gender')}
                options={genderOptions}
              />
              <Select
                label='Blood Type'
                value={form.bloodType}
                onChange={handleChange('bloodType')}
                options={bloodTypeOptions}
              />
              <Input
                label='City'
                value={form.city}
                onChange={handleChange('city')}
              />
              <Input
                label='Sub-City'
                value={form.subCity}
                onChange={handleChange('subCity')}
              />
              <Input
                label='Woreda'
                value={form.woreda}
                onChange={handleChange('woreda')}
              />
              <div className='col-span-2'>
                <label
                  className='text-sm font-medium mb-1.5 block'
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  Allergies
                </label>
                <textarea
                  value={form.allergies}
                  onChange={e =>
                    setForm(prev => ({ ...prev, allergies: e.target.value }))
                  }
                  placeholder='List any known allergies...'
                  rows={2}
                  className='w-full text-sm text-white placeholder-white/30 rounded-lg px-4 py-3 outline-none resize-none'
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                />
              </div>
            </div>
          </Card>

          {/* ── Emergency contact ────────────────── */}
          <Card>
            <h3 className='text-sm font-semibold text-white mb-4'>
              Emergency Contact
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Name'
                value={form.emergencyContact.name}
                onChange={handleEmergencyChange('name')}
                className='col-span-2'
              />
              <Input
                label='Phone'
                value={form.emergencyContact.phone}
                onChange={handleEmergencyChange('phone')}
              />
              <Input
                label='Relationship'
                value={form.emergencyContact.relationship}
                onChange={handleEmergencyChange('relationship')}
              />
            </div>
          </Card>

          <Button
            variant='primary'
            onClick={handleSaveProfile}
            isLoading={isSaving}
            size='lg'
          >
            💾 Save Profile
          </Button>
        </div>
      )}

      {activeTab === 'security' && (
        <Card>
          <h3 className='text-sm font-semibold text-white mb-4'>
            Change Password
          </h3>
          <form onSubmit={handleChangePassword} className='space-y-4'>
            <Input
              label='Current Password'
              type='password'
              value={pwForm.currentPassword}
              onChange={e =>
                setPwForm(p => ({ ...p, currentPassword: e.target.value }))
              }
              error={pwErrors.currentPassword}
              required
            />
            <Input
              label='New Password'
              type='password'
              value={pwForm.newPassword}
              onChange={e =>
                setPwForm(p => ({ ...p, newPassword: e.target.value }))
              }
              error={pwErrors.newPassword}
              required
            />
            <Input
              label='Confirm Password'
              type='password'
              value={pwForm.confirmPassword}
              onChange={e =>
                setPwForm(p => ({ ...p, confirmPassword: e.target.value }))
              }
              error={pwErrors.confirmPassword}
              required
            />
            <Button type='submit' variant='primary' isLoading={isSaving}>
              🔒 Change Password
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
