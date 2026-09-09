// UserTable.jsx — Admin user management table
import Table from '../ui/Table.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { formatDate } from '../../utils/formatters.js'

export default function UserTable ({
  users = [],
  isLoading,
  onActivate,
  onDeactivate,
  onResetPassword,
  onChangeRole
}) {
  const columns = [
    {
      key: 'firstName',
      label: 'Name',
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <div
            className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0'
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
          >
            {row.initials}
          </div>
          <div>
            <p className='text-sm font-medium text-white'>
              {row.firstName} {row.lastName}
            </p>
            <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
              {row.email}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: val => <Badge variant={val}>{val}</Badge>
    },
    {
      key: 'phone',
      label: 'Phone',
      render: val => (
        <span className='text-sm' style={{ color: 'rgba(255,255,255,0.65)' }}>
          {val || '—'}
        </span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: val => (
        <Badge variant={val ? 'green' : 'red'}>
          {val ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: val => (
        <span className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
          {formatDate(val)}
        </span>
      )
    },
    {
      key: '_id',
      label: 'Actions',
      render: (_, row) => (
        <div className='flex gap-1.5' onClick={e => e.stopPropagation()}>
          {row.isActive ? (
            <Button
              size='xs'
              variant='danger'
              onClick={() => onDeactivate?.(row)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size='xs'
              variant='success'
              onClick={() => onActivate?.(row)}
            >
              Activate
            </Button>
          )}
          <Button
            size='xs'
            variant='secondary'
            onClick={() => onResetPassword?.(row)}
          >
            Reset PW
          </Button>
        </div>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      data={users}
      isLoading={isLoading}
      emptyTitle='No users found'
      emptyMessage='No users match your current search or filter.'
    />
  )
}
