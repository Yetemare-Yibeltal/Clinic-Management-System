// AppRouter.jsx — All application routes with protection and role guards
import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ProtectedRoute from './ProtectedRoute.jsx'
import RoleRoute from './RoleRoute.jsx'
import { ROUTES } from '../constants/routes.js'
import { ROLES } from '../constants/roles.js'
import AppLayout from '../components/layout/AppLayout.jsx'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Spinner from '../components/ui/Spinner.jsx'

// ── Lazy loaded pages ──────────────────────────────────
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'))
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage.jsx'))
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage.jsx'))
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'))
const DoctorsPage = lazy(() => import('../pages/DoctorsPage.jsx'))
const DoctorProfilePage = lazy(() => import('../pages/DoctorProfilePage.jsx'))
const BookAppointmentPage = lazy(() =>
  import('../pages/BookAppointmentPage.jsx')
)
const MyAppointmentsPage = lazy(() => import('../pages/MyAppointmentsPage.jsx'))
const ManageAppointmentsPage = lazy(() =>
  import('../pages/ManageAppointmentsPage.jsx')
)
const SchedulePage = lazy(() => import('../pages/SchedulePage.jsx'))
const ReportsPage = lazy(() => import('../pages/ReportsPage.jsx'))
const PatientProfilePage = lazy(() => import('../pages/PatientProfilePage.jsx'))
const PaymentPage = lazy(() => import('../pages/PaymentPage.jsx'))
const PaymentCallbackPage = lazy(() =>
  import('../pages/PaymentCallbackPage.jsx')
)
const MedicalRecordsPage = lazy(() => import('../pages/MedicalRecordsPage.jsx'))
const NotificationsPage = lazy(() => import('../pages/NotificationsPage.jsx'))
const DepartmentsPage = lazy(() => import('../pages/DepartmentsPage.jsx'))
const ReviewPage = lazy(() => import('../pages/ReviewPage.jsx'))
const SearchPage = lazy(() => import('../pages/SearchPage.jsx'))
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage.jsx'))
const AdminUsersPage = lazy(() => import('../pages/AdminUsersPage.jsx'))
const AdminSettingsPage = lazy(() => import('../pages/AdminSettingsPage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage.jsx'))

// ── Loading fallback ───────────────────────────────────
function PageLoader () {
  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{ background: '#050b18' }}
    >
      <Spinner size='lg' />
    </div>
  )
}

export default function AppRouter () {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public auth routes ─────────────────────── */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* ── Protected app routes ───────────────────── */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard — all roles */}
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

          {/* Doctors — all roles can view */}
          <Route path={ROUTES.DOCTORS} element={<DoctorsPage />} />
          <Route path={ROUTES.DOCTOR_PROFILE} element={<DoctorProfilePage />} />

          {/* Search */}
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />

          {/* Notifications — all roles */}
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

          {/* Departments — all roles */}
          <Route path={ROUTES.DEPARTMENTS} element={<DepartmentsPage />} />

          {/* Patient-only routes */}
          <Route
            path={ROUTES.BOOK_APPOINTMENT}
            element={
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <BookAppointmentPage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.MY_APPOINTMENTS}
            element={
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <MyAppointmentsPage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.PATIENT_PROFILE}
            element={
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <PatientProfilePage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.PAYMENT}
            element={
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <PaymentPage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.PAYMENT_CALLBACK}
            element={
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <PaymentCallbackPage />
              </RoleRoute>
            }
          />

          <Route
            path='/reviews/submit/:appointmentId'
            element={
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <ReviewPage />
              </RoleRoute>
            }
          />

          {/* Doctor-only routes */}
          <Route
            path={ROUTES.SCHEDULE}
            element={
              <RoleRoute allowedRoles={[ROLES.DOCTOR, ROLES.ADMIN]}>
                <SchedulePage />
              </RoleRoute>
            }
          />

          {/* Doctor and Admin routes */}
          <Route
            path={ROUTES.MANAGE_APPOINTMENTS}
            element={
              <RoleRoute allowedRoles={[ROLES.DOCTOR, ROLES.ADMIN]}>
                <ManageAppointmentsPage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.MEDICAL_RECORDS}
            element={
              <RoleRoute
                allowedRoles={[ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN]}
              >
                <MedicalRecordsPage />
              </RoleRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path={ROUTES.REPORTS}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <ReportsPage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminUsersPage />
              </RoleRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_SETTINGS}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminSettingsPage />
              </RoleRoute>
            }
          />
        </Route>

        {/* ── Error pages ────────────────────────────── */}
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />

        {/* ── Redirects ──────────────────────────────── */}
        <Route path='/' element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path='*' element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  )
}
