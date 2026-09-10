// DepartmentDetailPage.jsx — Single department detail with doctors
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import DoctorCard from '../components/doctors/DoctorCard.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import { departmentService } from '../services/departmentService.js'
import { formatETB } from '../utils/formatters.js'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../constants/routes.js'

export default function DepartmentDetailPage () {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isPatient } = useAuth()
  const [department, setDepartment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    departmentService
      .getDepartmentById(id)
      .then(({ department: dept, doctors }) => {
        setDepartment({ ...dept, doctors: doctors || [] })
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading)
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='xl' />
      </div>
    )
  if (notFound || !department)
    return <Alert type='error' title='Department not found' />

  return (
    <div className='space-y-6'>
      <PageHeader
        title={department.name}
        subtitle={department.description}
        icon='🏥'
      />

      {/* ── Department info ──────────────────────── */}
      <div className='glass-card rounded-2xl p-6'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm'>
          {[
            { label: 'Floor', value: department.floor || 'N/A' },
            { label: 'Room', value: department.room || 'N/A' },
            { label: 'Phone', value: department.phone || 'N/A' },
            { label: 'Doctors', value: department.doctors?.length || 0 }
          ].map(({ label, value }) => (
            <div
              key={label}
              className='p-3 rounded-xl'
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <p
                className='text-xs mb-1'
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {label}
              </p>
              <p className='font-semibold text-white'>{value}</p>
            </div>
          ))}
        </div>

        {department.services?.length > 0 && (
          <div className='mt-4'>
            <p
              className='text-xs font-semibold mb-2'
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Services
            </p>
            <div className='flex flex-wrap gap-2'>
              {department.services.map((service, i) => (
                <Badge key={i} variant='blue'>
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Doctors ──────────────────────────────── */}
      {department.doctors?.length > 0 && (
        <div>
          <h3 className='text-sm font-semibold text-white mb-4'>
            Doctors in this Department ({department.doctors.length})
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {department.doctors.map(doctor => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onBook={
                  isPatient
                    ? () =>
                        navigate(
                          `${ROUTES.BOOK_APPOINTMENT}?doctorId=${doctor._id}`
                        )
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
