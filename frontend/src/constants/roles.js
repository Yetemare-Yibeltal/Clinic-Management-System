// roles.js — User role constants
export const ROLES = {
  ADMIN:   'admin',
  DOCTOR:  'doctor',
  PATIENT: 'patient',
}

export const ROLE_LABELS = {
  admin:   'Administrator',
  doctor:  'Doctor',
  patient: 'Patient',
}

export const ROLE_COLORS = {
  admin:   'bg-purple-500/20 text-purple-400',
  doctor:  'bg-blue-500/20 text-blue-400',
  patient: 'bg-green-500/20 text-green-400',
}

export const ROLE_REDIRECTS = {
  admin:   '/dashboard',
  doctor:  '/dashboard',
  patient: '/dashboard',
}