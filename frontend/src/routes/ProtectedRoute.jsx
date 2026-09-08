// ProtectedRoute.jsx — Redirects to login if not authenticated
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import { ROUTES } from '../constants/routes.js'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore()
  const location       = useLocation()

  if (!isLoggedIn) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    )
  }

  return children
}