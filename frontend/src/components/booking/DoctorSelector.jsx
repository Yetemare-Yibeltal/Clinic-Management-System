// DoctorSelector.jsx — Step 1 of booking: pick a doctor
import { useEffect } from 'react'
import useDoctorStore from '../../store/doctorStore.js'
import DoctorCard from '../doctors/DoctorCard.jsx'
import DoctorFilter from '../doctors/DoctorFilter.jsx'
import Spinner from '../ui/Spinner.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function DoctorSelector ({ selectedDoctor, onSelect }) {
  const {
    doctors,
    specializations,
    isLoading,
    filters,
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

  return (
    <div className='space-y-4'>
      <DoctorFilter
        filters={filters}
        onFilterChange={changes => setFilters(changes)}
        specializations={specializations}
      />

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon='👨‍⚕️'
          title='No doctors available'
          message='Try a different search or filter.'
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1'>
          {doctors.map(doctor => (
            <div
              key={doctor._id}
              onClick={() => onSelect(doctor)}
              className='cursor-pointer transition-all duration-200'
              style={
                selectedDoctor?._id === doctor._id
                  ? { outline: '2px solid #2563eb', borderRadius: '16px' }
                  : {}
              }
            >
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
