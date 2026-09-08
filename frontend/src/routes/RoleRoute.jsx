// RoleRoute.jsx — Redirects if user does not have required role
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import { ROUTES } from '../constants/routes.js'

export default function RoleRoute ({ children, allowedRoles = [] }) {
  const { user, isLoggedIn } = useAuthStore()

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return children
}
