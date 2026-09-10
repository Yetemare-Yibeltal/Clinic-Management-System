// AdminSettingsPage.jsx — Admin clinic settings page
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import ClinicInfo from '../components/clinic/ClinicInfo.jsx'
import WorkingHours from '../components/clinic/WorkingHours.jsx'
import HolidayManager from '../components/clinic/HolidayManager.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import useClinicStore from '../store/clinicStore.js'
import { useToast } from '../hooks/useToast.js'
import api from '../services/api.js'
import { API } from '../constants/apiEndpoints.js'

export default function AdminSettingsPage () {
  const { settings, fetchSettings, updateSettings, updatePaymentAccounts } =
    useClinicStore()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('clinic')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [payForm, setPayForm] = useState({})
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    startDate: '',
    endDate: '',
    type: 'ethiopian_public'
  })

  useEffect(() => {
    fetchSettings()
      .then(s => {
        if (s) {
          setEditForm({
            clinicName: s.clinicName,
            tagline: s.tagline,
            email: s.email,
            phone: s.phone,
            website: s.website
          })
          setPayForm(s.paymentSettings || {})
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSaveClinic = async () => {
    setIsSaving(true)
    const result = await updateSettings(editForm)
    result.success ? success('Clinic info updated!') : error(result.error)
    setIsSaving(false)
  }

  const handleSavePayments = async () => {
    setIsSaving(true)
    const result = await updatePaymentAccounts(payForm)
    result.success ? success('Payment accounts updated!') : error(result.error)
    setIsSaving(false)
  }

  const handleAddHoliday = async () => {
    if (!newHoliday.name || !newHoliday.startDate) {
      error('Holiday name and date are required')
      return
    }
    try {
      await api.post(API.HOLIDAYS.CREATE, {
        ...newHoliday,
        endDate: newHoliday.endDate || newHoliday.startDate
      })
      success('Holiday added!')
      setNewHoliday({
        name: '',
        startDate: '',
        endDate: '',
        type: 'ethiopian_public'
      })
    } catch (err) {
      error(err.response?.data?.error || 'Failed to add holiday')
    }
  }

  const tabs = [
    { value: 'clinic', label: 'Clinic Info', icon: '🏥' },
    { value: 'payments', label: 'Payment Accounts', icon: '💳' },
    { value: 'hours', label: 'Working Hours', icon: '⏰' },
    { value: 'holidays', label: 'Holidays', icon: '📅' }
  ]

  if (isLoading)
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='xl' />
      </div>
    )

  return (
    <div className='space-y-6 max-w-3xl'>
      <PageHeader
        title='Clinic Settings'
        subtitle='Manage Kidus Yared Healthcare configuration'
        icon='⚙️'
      />

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'clinic' && (
        <Card>
          <h3 className='text-sm font-semibold text-white mb-4'>
            Clinic Information
          </h3>
          <div className='space-y-4'>
            <Input
              label='Clinic Name'
              value={editForm.clinicName || ''}
              onChange={e =>
                setEditForm(p => ({ ...p, clinicName: e.target.value }))
              }
            />
            <Input
              label='Tagline'
              value={editForm.tagline || ''}
              onChange={e =>
                setEditForm(p => ({ ...p, tagline: e.target.value }))
              }
            />
            <Input
              label='Email'
              value={editForm.email || ''}
              onChange={e =>
                setEditForm(p => ({ ...p, email: e.target.value }))
              }
              type='email'
            />
            <Input
              label='Phone'
              value={editForm.phone || ''}
              onChange={e =>
                setEditForm(p => ({ ...p, phone: e.target.value }))
              }
            />
            <Input
              label='Website'
              value={editForm.website || ''}
              onChange={e =>
                setEditForm(p => ({ ...p, website: e.target.value }))
              }
            />
            <Button
              variant='primary'
              onClick={handleSaveClinic}
              isLoading={isSaving}
            >
              💾 Save Changes
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <h3 className='text-sm font-semibold text-white mb-4'>
            Payment Account Numbers
          </h3>
          <div className='space-y-4'>
            <Input
              label='TeleBirr Account'
              value={payForm.teleBirrAccount || ''}
              onChange={e =>
                setPayForm(p => ({ ...p, teleBirrAccount: e.target.value }))
              }
            />
            <Input
              label='CBE Birr Account'
              value={payForm.cbeBirrAccount || ''}
              onChange={e =>
                setPayForm(p => ({ ...p, cbeBirrAccount: e.target.value }))
              }
            />
            <Input
              label='Awash Birr Account'
              value={payForm.awashBirrAccount || ''}
              onChange={e =>
                setPayForm(p => ({ ...p, awashBirrAccount: e.target.value }))
              }
            />
            <Input
              label='HelloCash Account'
              value={payForm.helloCashAccount || ''}
              onChange={e =>
                setPayForm(p => ({ ...p, helloCashAccount: e.target.value }))
              }
            />
            <Input
              label='Bank Name'
              value={payForm.bankName || ''}
              onChange={e =>
                setPayForm(p => ({ ...p, bankName: e.target.value }))
              }
            />
            <Input
              label='Bank Account Number'
              value={payForm.bankAccountNumber || ''}
              onChange={e =>
                setPayForm(p => ({ ...p, bankAccountNumber: e.target.value }))
              }
            />
            <Input
              label='Bank Account Name'
              value={payForm.bankAccountName || ''}
              onChange={e =>
                setPayForm(p => ({ ...p, bankAccountName: e.target.value }))
              }
            />
            <Button
              variant='primary'
              onClick={handleSavePayments}
              isLoading={isSaving}
            >
              💾 Save Payment Accounts
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'hours' && (
        <WorkingHours workingHours={settings?.workingHours} />
      )}

      {activeTab === 'holidays' && (
        <div className='space-y-5'>
          <Card>
            <h3 className='text-sm font-semibold text-white mb-4'>
              Add Holiday
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Holiday Name'
                value={newHoliday.name}
                onChange={e =>
                  setNewHoliday(p => ({ ...p, name: e.target.value }))
                }
                placeholder='e.g. Ethiopian Christmas'
                className='col-span-2'
              />
              <Input
                label='Start Date'
                value={newHoliday.startDate}
                onChange={e =>
                  setNewHoliday(p => ({ ...p, startDate: e.target.value }))
                }
                type='date'
              />
              <Input
                label='End Date'
                value={newHoliday.endDate}
                onChange={e =>
                  setNewHoliday(p => ({ ...p, endDate: e.target.value }))
                }
                type='date'
              />
            </div>
            <Button
              variant='primary'
              className='mt-4'
              onClick={handleAddHoliday}
            >
              ➕ Add Holiday
            </Button>
          </Card>

          <Card>
            <h3 className='text-sm font-semibold text-white mb-4'>
              Current Holidays
            </h3>
            <HolidayManager />
          </Card>
        </div>
      )}
    </div>
  )
}
