// DoctorsPage.jsx — Browse all doctors with search and filter
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import DoctorList from '../components/doctors/DoctorList.jsx'
import DoctorFilter from '../components/doctors/DoctorFilter.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import useDoctorStore from '../store/doctorStore.js'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../constants/routes.js'

export default function DoctorsPage () {
  const navigate = useNavigate()
  const { isPatient } = useAuth()
  const {
    doctors,
    isLoading,
    filters,
    specializations,
    setFilters,
    fetchDoctors,
    fetchSpecializations
  } = useDoctorStore()

  useEffect(() => {
    fetchDoctors()
    fetchSpecializations()
  }, [])

  useEffect(() => {
    fetchDoctors()
  }, [filters])

  const handleBook = doctor => {
    if (isPatient) {
      navigate(`${ROUTES.BOOK_APPOINTMENT}?doctorId=${doctor._id}`)
    } else {
      navigate(`/doctors/${doctor._id}`)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Find a Doctor'
        subtitle={`${doctors.length} doctors available at Kidus Yared Healthcare`}
        icon='👨‍⚕️'
      />

      <DoctorFilter
        filters={filters}
        onFilterChange={changes => setFilters(changes)}
        specializations={specializations}
      />

      <DoctorList doctors={doctors} isLoading={isLoading} onBook={handleBook} />
    </div>
  )
}
