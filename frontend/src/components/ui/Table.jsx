// Table.jsx — Responsive data table with sorting and empty state
import Spinner from './Spinner.jsx'
import EmptyState from './EmptyState.jsx'

export default function Table ({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = 'No data found',
  emptyMessage = 'No records to display.',
  onRowClick = null,
  selectedIds = [],
  onSelect = null,
  keyField = '_id'
}) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Spinner size='lg' />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <div
      className='overflow-x-auto rounded-xl'
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <table className='w-full text-sm'>
        <thead>
          <tr
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {onSelect && (
              <th className='w-10 px-4 py-3 text-left'>
                <input
                  type='checkbox'
                  className='rounded'
                  checked={
                    selectedIds.length === data.length && data.length > 0
                  }
                  onChange={e => {
                    if (e.target.checked) onSelect(data.map(r => r[keyField]))
                    else onSelect([])
                  }}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className='px-4 py-3 text-left font-semibold'
                style={{ color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row[keyField] || i}
              onClick={() => onRowClick?.(row)}
              className='transition-colors duration-150'
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: selectedIds.includes(row[keyField])
                  ? 'rgba(37,99,235,0.08)'
                  : 'transparent',
                cursor: onRowClick ? 'pointer' : 'default'
              }}
              onMouseEnter={e => {
                if (!selectedIds.includes(row[keyField])) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }
              }}
              onMouseLeave={e => {
                if (!selectedIds.includes(row[keyField])) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {onSelect && (
                <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                  <input
                    type='checkbox'
                    className='rounded'
                    checked={selectedIds.includes(row[keyField])}
                    onChange={e => {
                      if (e.target.checked)
                        onSelect([...selectedIds, row[keyField]])
                      else
                        onSelect(selectedIds.filter(id => id !== row[keyField]))
                    }}
                  />
                </td>
              )}
              {columns.map(col => (
                <td
                  key={col.key}
                  className='px-4 py-3'
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
