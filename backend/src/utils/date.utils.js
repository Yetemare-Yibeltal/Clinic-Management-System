// date.utils.js — Date formatting and calculation utilities
// Used across controllers, services and reports

// ── Format a date for display ──────────────────────────
// Input:  "2025-06-25"
// Output: "June 25, 2025"
export function formatDisplayDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

// ── Format a date for short display ───────────────────
// Input:  "2025-06-25"
// Output: "Jun 25, 2025"
export function formatShortDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  })
}

// ── Format date and time together ─────────────────────
// Input:  "2025-06-25", "9:00 AM"
// Output: "June 25, 2025 at 9:00 AM"
export function formatDateTime(dateString, timeString) {
  if (!dateString) return ''
  const formattedDate = formatDisplayDate(dateString)
  if (!timeString) return formattedDate
  return `${formattedDate} at ${timeString}`
}

// ── Check if a date is in the past ────────────────────
export function isDateInPast(dateString) {
  const date  = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// ── Check if a date is today ───────────────────────────
export function isToday(dateString) {
  const date  = new Date(dateString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth()    === today.getMonth() &&
    date.getDate()     === today.getDate()
  )
}

// ── Check if a date is tomorrow ────────────────────────
export function isTomorrow(dateString) {
  const date     = new Date(dateString)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth()    === tomorrow.getMonth() &&
    date.getDate()     === tomorrow.getDate()
  )
}

// ── Get start and end of a day ─────────────────────────
export function getDayRange(dateString) {
  const date  = new Date(dateString)
  const start = new Date(date.setHours(0, 0, 0, 0))
  const end   = new Date(date.setHours(23, 59, 59, 999))
  return { start, end }
}

// ── Get date range for reports ─────────────────────────
// range: 'today' | 'week' | 'month' | 'year' | 'custom'
export function getDateRange(range, customStart = null, customEnd = null) {
  const now   = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))

  switch (range) {
    case 'today':
      return {
        start: today,
        end:   new Date(new Date().setHours(23, 59, 59, 999)),
      }

    case 'week': {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)
      return { start: weekStart, end: weekEnd }
    }

    case 'month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd   = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      monthEnd.setHours(23, 59, 59, 999)
      return { start: monthStart, end: monthEnd }
    }

    case 'year': {
      const yearStart = new Date(today.getFullYear(), 0, 1)
      const yearEnd   = new Date(today.getFullYear(), 11, 31)
      yearEnd.setHours(23, 59, 59, 999)
      return { start: yearStart, end: yearEnd }
    }

    case 'custom':
      return {
        start: customStart ? new Date(customStart) : today,
        end:   customEnd   ? new Date(customEnd)   : new Date(),
      }

    default:
      return {
        start: today,
        end:   new Date(),
      }
  }
}

// ── Calculate hours between two times ─────────────────
// Input:  "9:00 AM", "11:30 AM"
// Output: 2.5
export function hoursBetweenTimes(startTime, endTime) {
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return hours + minutes / 60
  }

  return parseTime(endTime) - parseTime(startTime)
}

// ── Get day name from date ─────────────────────────────
// Input:  "2025-06-25"
// Output: "Wednesday"
export function getDayName(dateString) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date(dateString).getDay()]
}

// ── Format relative time ───────────────────────────────
// Input:  a past Date object
// Output: "2 hours ago" | "3 days ago" | "just now"
export function formatRelativeTime(date) {
  const now     = new Date()
  const diffMs  = now - new Date(date)
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr  = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60)  return 'just now'
  if (diffMin < 60)  return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  if (diffHr  < 24)  return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`
  if (diffDay < 7)   return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  return formatShortDate(date)
}

// ── Convert date to YYYY-MM-DD string ─────────────────
export function toDateString(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// ── Get today as YYYY-MM-DD string ─────────────────────
export function todayString() {
  return toDateString(new Date())
}