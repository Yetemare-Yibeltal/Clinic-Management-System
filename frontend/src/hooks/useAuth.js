// useAuth.js — Auth hook with role helpers
import useAuthStore from "../store/authStore.js";
import { ROLES } from "../constants/roles.js";

export function useAuth() {
  const {
    user,
    token,
    isLoggedIn,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,
  } = useAuthStore();

  return {
    user,
    token,
    isLoggedIn,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,

    // ── Computed role helpers ────────────────────────
    isAdmin: user?.role === ROLES.ADMIN,
    isDoctor: user?.role === ROLES.DOCTOR,
    isPatient: user?.role === ROLES.PATIENT,
    role: user?.role || null,
    userId: user?.id || null,
  };
}
