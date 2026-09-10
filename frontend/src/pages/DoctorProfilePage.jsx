// DoctorProfilePage.jsx — Full doctor profile with reviews and booking
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import DoctorProfile from '../components/doctors/DoctorProfile.jsx'
import DoctorReviews from '../components/doctors/DoctorReviews.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import { useState } from 'react'
import useDoctorStore from '../store/doctorStore.js'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../constants/routes.js'

export default function DoctorProfilePage () {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isPatient } = useAuth()
  const { selectedDoctor, isLoading, fetchDoctorById } = useDoctorStore()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (id) fetchDoctorById(id)
  }, [id])

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='xl' />
      </div>
    )
  }

  if (!selectedDoctor) {
    return (
      <div className='text-center py-20'>
        <p className='text-5xl mb-4'>👨‍⚕️</p>
        <p className='text-lg font-semibold text-white'>Doctor not found</p>
      </div>
    )
  }

  const tabs = [
    { value: 'profile', label: 'Profile', icon: '👤' },
    {
      value: 'reviews',
      label: 'Reviews',
      icon: '⭐',
      count: selectedDoctor.totalReviews
    }
  ]

  return (
    <div className='space-y-6 max-w-3xl'>
      <PageHeader
        title={`Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
        subtitle={selectedDoctor.specialization}
        icon='👨‍⚕️'
      />

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'profile' && (
        <DoctorProfile
          doctor={selectedDoctor}
          showBookButton={isPatient}
          onBook={() =>
            navigate(
              `${ROUTES.BOOK_APPOINTMENT}?doctorId=${selectedDoctor._id}`
            )
          }
        />
      )}

      {activeTab === 'reviews' && <DoctorReviews doctorId={id} />}
    </div>
  )
}
