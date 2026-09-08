// AppLayout.jsx — Main authenticated app layout with sidebar and navbar
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import useUIStore from '../../store/uiStore.js'
import useAuthStore from '../../store/authStore.js'
import { useNotifications } from '../../hooks/useNotifications.js'
import ConfirmDialog from '../ui/ConfirmDialog.jsx'

export default function AppLayout () {
  const { sidebarOpen, confirmDialog, closeConfirm } = useUIStore()
  const { user } = useAuthStore()
  const { loadNotifications } = useNotifications()

  // Load notifications on mount
  useEffect(() => {
    if (user) loadNotifications()
  }, [user])

  return (
    <div className='min-h-screen flex' style={{ background: '#050b18' }}>
      {/* ── Sidebar ───────────────────────────────────── */}
      <Sidebar />

      {/* ── Main content area ─────────────────────────── */}
      <div
        className='flex-1 flex flex-col min-h-screen transition-all duration-300'
        style={{ marginLeft: sidebarOpen ? '260px' : '0px' }}
      >
        {/* ── Top navbar ───────────────────────────────── */}
        <Navbar />

        {/* ── Page content ─────────────────────────────── */}
        <main className='flex-1 p-6 overflow-auto'>
          <Outlet />
        </main>
      </div>

      {/* ── Global confirm dialog ─────────────────────── */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          onConfirm={() => {
            confirmDialog.onConfirm?.()
            closeConfirm()
          }}
          onCancel={() => {
            confirmDialog.onCancel?.()
            closeConfirm()
          }}
        />
      )}
    </div>
  )
}
