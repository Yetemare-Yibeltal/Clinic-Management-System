// MedicalRecordsPage.jsx — View medical records for all roles
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import MedicalRecordCard from '../components/medical/MedicalRecordCard.jsx'
import Modal from '../components/ui/Modal.jsx'
import VitalsForm from '../components/medical/VitalsForm.jsx'
import PrescriptionList from '../components/medical/PrescriptionList.jsx'
import LabTestList from '../components/medical/LabTestList.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { formatDate } from '../utils/formatters.js'
import { medicalRecordService } from '../services/medicalRecordService.js'

export default function MedicalRecordsPage () {
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    medicalRecordService
      .getRecords()
      .then(data => setRecords(data.records || []))
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
        title='Medical Records'
        subtitle={`${records.length} records in your history`}
        icon='📋'
      />

      {records.length === 0 ? (
        <EmptyState
          icon='📋'
          title='No medical records'
          message='Your medical records will appear here after your appointments.'
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {records.map(record => (
            <MedicalRecordCard
              key={record._id}
              record={record}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {/* ── Record detail modal ──────────────────── */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title='Medical Record Details'
        size='lg'
      >
        {selected && (
          <div className='space-y-5'>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              {[
                { label: 'Visit Date', value: formatDate(selected.visitDate) },
                { label: 'Visit Type', value: selected.visitType },
                {
                  label: 'Doctor',
                  value: `Dr. ${selected.doctor?.firstName} ${selected.doctor?.lastName}`
                },
                {
                  label: 'Specialization',
                  value: selected.doctor?.specialization
                }
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
                  <p className='text-sm font-medium text-white'>
                    {value || '—'}
                  </p>
                </div>
              ))}
            </div>

            {selected.chiefComplaint && (
              <div>
                <p
                  className='text-xs font-semibold mb-2'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Chief Complaint
                </p>
                <p className='text-sm text-white'>{selected.chiefComplaint}</p>
              </div>
            )}

            {selected.diagnosis && (
              <div>
                <p
                  className='text-xs font-semibold mb-2'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Diagnosis
                </p>
                <p className='text-sm text-white'>{selected.diagnosis}</p>
              </div>
            )}

            {selected.vitals &&
              Object.keys(selected.vitals).some(k => selected.vitals[k]) && (
                <div>
                  <p
                    className='text-xs font-semibold mb-3'
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Vitals
                  </p>
                  <VitalsForm values={selected.vitals} readOnly />
                </div>
              )}

            {selected.prescriptions?.length > 0 && (
              <div>
                <p
                  className='text-xs font-semibold mb-2'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Prescriptions
                </p>
                <PrescriptionList
                  prescriptions={selected.prescriptions}
                  readOnly
                />
              </div>
            )}

            {selected.labTests?.length > 0 && (
              <div>
                <p
                  className='text-xs font-semibold mb-2'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Lab Tests
                </p>
                <LabTestList labTests={selected.labTests} />
              </div>
            )}

            {selected.doctorNotes && (
              <div>
                <p
                  className='text-xs font-semibold mb-2'
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Doctor Notes
                </p>
                <p
                  className='text-sm'
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {selected.doctorNotes}
                </p>
              </div>
            )}

            {selected.followUpRequired && selected.followUpDate && (
              <div
                className='p-3 rounded-xl'
                style={{
                  background: 'rgba(37,99,235,0.1)',
                  border: '1px solid rgba(37,99,235,0.25)'
                }}
              >
                <p className='text-sm font-medium text-white'>
                  📅 Follow-up required on:{' '}
                  <strong>{formatDate(selected.followUpDate)}</strong>
                </p>
                {selected.followUpInstructions && (
                  <p
                    className='text-xs mt-1'
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {selected.followUpInstructions}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
