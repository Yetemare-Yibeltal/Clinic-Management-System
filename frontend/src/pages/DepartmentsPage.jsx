// DepartmentsPage.jsx — Clinic departments listing
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { departmentService } from '../services/departmentService.js'

export default function DepartmentsPage () {
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    departmentService
      .getDepartments({ isActive: true })
      .then(data => setDepartments(Array.isArray(data) ? data : []))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading)
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='xl' />
      </div>
    )

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Departments'
        subtitle={`${departments.length} departments at Kidus Yared Healthcare`}
        icon='🏥'
      />

      {departments.length === 0 ? (
        <EmptyState icon='🏥' title='No departments found' />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {departments.map(dept => (
            <div
              key={dept._id}
              onClick={() =>
                setSelected(selected?._id === dept._id ? null : dept)
              }
              className='glass-card card-hover rounded-2xl p-5 cursor-pointer space-y-3'
            >
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <h3
                    className='text-base font-bold text-white'
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {dept.name}
                  </h3>
                  <p
                    className='text-xs mt-0.5'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {dept.shortCode} · Floor: {dept.floor || 'N/A'}
                  </p>
                </div>
                <span
                  className='text-xs px-2 py-0.5 rounded-full'
                  style={{
                    background: dept.isActive
                      ? 'rgba(5,150,105,0.2)'
                      : 'rgba(220,38,38,0.2)',
                    color: dept.isActive ? '#34d399' : '#f87171'
                  }}
                >
                  {dept.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {dept.description && (
                <p
                  className='text-xs'
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {dept.description}
                </p>
              )}

              <div
                className='flex items-center gap-4 text-xs'
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {dept.phone && <span>📞 {dept.phone}</span>}
                {dept.totalDoctors !== undefined && (
                  <span>👨‍⚕️ {dept.totalDoctors} doctors</span>
                )}
              </div>

              {dept.services?.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {dept.services.slice(0, 3).map((service, i) => (
                    <span
                      key={i}
                      className='text-xs px-2 py-0.5 rounded-full'
                      style={{
                        background: 'rgba(37,99,235,0.15)',
                        color: '#60a5fa'
                      }}
                    >
                      {service}
                    </span>
                  ))}
                  {dept.services.length > 3 && (
                    <span
                      className='text-xs px-2 py-0.5 rounded-full'
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.4)'
                      }}
                    >
                      +{dept.services.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
