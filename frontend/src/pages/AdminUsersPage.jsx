// AdminUsersPage.jsx — Admin user management page
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import UserTable from '../components/admin/UserTable.jsx'
import UserFilter from '../components/admin/UserFilter.jsx'
import AuditLog from '../components/admin/AuditLog.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { adminService } from '../services/adminService.js'
import { useToast } from '../hooks/useToast.js'
import { usePagination } from '../hooks/usePagination.js'

export default function AdminUsersPage () {
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', role: '', isActive: '' })
  const [resetModal, setResetModal] = useState(null)
  const {
    page,
    limit,
    total,
    setTotalItems,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage
  } = usePagination()

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await adminService.getAllUsers({ ...filters, page, limit })
      setUsers(data.users || [])
      setTotalItems(data.pagination?.total || 0)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAuditLogs = async () => {
    setIsLoading(true)
    try {
      const data = await adminService.getAuditLogs({ limit: 50 })
      setAuditLogs(data.logs || [])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'users') loadUsers()
    if (activeTab === 'audit') loadAuditLogs()
  }, [activeTab, filters, page])

  const handleActivate = async user => {
    try {
      await adminService.updateUserStatus(user._id, true)
      success(`${user.firstName} activated.`)
      loadUsers()
    } catch (err) {
      error(err.response?.data?.error || 'Failed')
    }
  }

  const handleDeactivate = async user => {
    try {
      await adminService.updateUserStatus(user._id, false)
      success(`${user.firstName} deactivated.`)
      loadUsers()
    } catch (err) {
      error(err.response?.data?.error || 'Failed')
    }
  }

  const handleResetPassword = async user => {
    try {
      const result = await adminService.resetUserPassword(user._id)
      setResetModal({ user, tempPassword: result.temporaryPassword })
    } catch (err) {
      error(err.response?.data?.error || 'Failed')
    }
  }

  const tabs = [
    { value: 'users', label: 'Users', icon: '👥' },
    { value: 'audit', label: 'Audit Logs', icon: '📋' }
  ]

  return (
    <div className='space-y-6'>
      <PageHeader
        title='User Management'
        subtitle='Manage all system users'
        icon='👥'
      />

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'users' && (
        <>
          <UserFilter
            filters={filters}
            onFilterChange={c => setFilters(prev => ({ ...prev, ...c }))}
          />
          <UserTable
            users={users}
            isLoading={isLoading}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onResetPassword={handleResetPassword}
          />
          <Pagination
            page={page}
            totalPages={Math.ceil(total / limit)}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onNext={nextPage}
            onPrev={prevPage}
            onGoTo={goToPage}
            total={total}
            limit={limit}
          />
        </>
      )}

      {activeTab === 'audit' && (
        <AuditLog logs={auditLogs} isLoading={isLoading} />
      )}

      {/* ── Reset password result modal ────────── */}
      <Modal
        isOpen={!!resetModal}
        onClose={() => setResetModal(null)}
        title='Password Reset Successful'
        footer={
          <Button variant='primary' onClick={() => setResetModal(null)}>
            Done
          </Button>
        }
      >
        {resetModal && (
          <div className='space-y-3'>
            <p className='text-sm' style={{ color: 'rgba(255,255,255,0.6)' }}>
              Password reset for{' '}
              <strong className='text-white'>{resetModal.user?.email}</strong>
            </p>
            <div
              className='p-4 rounded-xl'
              style={{
                background: 'rgba(5,150,105,0.1)',
                border: '1px solid rgba(5,150,105,0.25)'
              }}
            >
              <p className='text-xs mb-1' style={{ color: '#34d399' }}>
                Temporary Password:
              </p>
              <p className='text-lg font-bold text-white font-mono'>
                {resetModal.tempPassword}
              </p>
            </div>
            <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
              Share this password with the user. They should change it after
              logging in.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
