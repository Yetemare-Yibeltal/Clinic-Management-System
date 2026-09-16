// Toast.jsx — Toast notification wrapper (uses react-hot-toast internally)
import toast from 'react-hot-toast'

export function showToast (message, type = 'default') {
  switch (type) {
    case 'success':
      return toast.success(message)
    case 'error':
      return toast.error(message)
    case 'loading':
      return toast.loading(message)
    default:
      return toast(message)
  }
}

export default function Toast () {
  return null
}
