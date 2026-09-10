// SchedulePage.jsx — Doctor weekly schedule editor
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import PageHeader from '../components/layout/PageHeader.jsx'
import WeeklyGrid from '../components/schedule/WeeklyGrid.jsx'
import ScheduleSummary from '../components/schedule/ScheduleSummary.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import useDoctorStore from '../store/doctorStore.js'

export default function SchedulePage () {
  const { user, isAdmin } = useAuth()
  const { success, error } = useToast()
  const {
    schedule,
    isLoadingSchedule,
    fetchSchedule,
    saveSchedule,
    updateSlot
  } = useDoctorStore()

  const [weeklyGrid, setWeeklyGrid] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const doctorId = user?._id || user?.id

  useEffect(() => {
    if (doctorId) fetchSchedule(doctorId)
  }, [doctorId])

  useEffect(() => {
    if (schedule?.weeklyGrid) {
      setWeeklyGrid(schedule.weeklyGrid)
    }
  }, [schedule])

  const handleSlotToggle = (dayIndex, slotIndex, currentStatus) => {
    const nextStatus =
      currentStatus === 'avail'
        ? 'closed'
        : currentStatus === 'closed'
        ? 'avail'
        : currentStatus === 'break'
        ? 'avail'
        : 'closed'

    setWeeklyGrid(prev => ({
      ...prev,
      [String(dayIndex)]: {
        ...(prev[String(dayIndex)] || {}),
        [String(slotIndex)]: nextStatus
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveSchedule(doctorId, weeklyGrid)
    if (result.success) {
      success('Schedule saved successfully!')
      setHasChanges(false)
    } else {
      error(result.error || 'Failed to save schedule')
    }
    setIsSaving(false)
  }

  if (isLoadingSchedule) {
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='xl' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='My Schedule'
        subtitle='Set your weekly availability — click slots to toggle'
        icon='🗓️'
        actions={
          hasChanges && (
            <Button variant='primary' isLoading={isSaving} onClick={handleSave}>
              💾 Save Changes
            </Button>
          )
        }
      />

      <ScheduleSummary weeklyGrid={weeklyGrid} />

      <div className='glass-card rounded-2xl p-5 overflow-x-auto'>
        <WeeklyGrid
          weeklyGrid={weeklyGrid}
          onSlotToggle={handleSlotToggle}
          readOnly={false}
        />
      </div>

      {hasChanges && (
        <div className='flex justify-end'>
          <Button
            variant='primary'
            isLoading={isSaving}
            onClick={handleSave}
            size='lg'
          >
            💾 Save Schedule
          </Button>
        </div>
      )}
    </div>
  )
}
