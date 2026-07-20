// cron.config.js — Scheduled background jobs for Kidus Yared Healthcare
import cron from 'node-cron'
import Appointment from '../models/Appointment.model.js'
import TokenBlacklist from '../models/TokenBlacklist.model.js'
import { sendAppointmentReminderEmail } from '../services/email.service.js'
import { notifyAppointmentReminder } from '../services/notification.service.js'
import { logger } from './logger.config.js'

export function startCronJobs() {
  // ── Send appointment reminders every day at 8:00 AM ──
  cron.schedule('0 8 * * *', async () => {
    try {
      logger.info('Running appointment reminder job...')

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      const appointments = await Appointment.find({
        date:   tomorrowStr,
        status: 'confirmed',
      })
        .populate('patient', 'firstName lastName email phone')
        .populate('doctor',  'firstName lastName specialization')

      let sent = 0
      for (const appointment of appointments) {
        if (appointment.patient?.email) {
          await sendAppointmentReminderEmail(appointment)
          await notifyAppointmentReminder(appointment)
          sent++
        }
      }

      logger.info(`Appointment reminders sent: ${sent}`)
    } catch (err) {
      logger.error('Appointment reminder job failed:', err.message)
    }
  })

  // ── Clean expired blacklisted tokens every midnight ──
  cron.schedule('0 0 * * *', async () => {
    try {
      const result = await TokenBlacklist.deleteMany({
        expiresAt: { $lt: new Date() },
      })
      logger.info(`Cleaned ${result.deletedCount} expired blacklisted tokens`)
    } catch (err) {
      logger.error('Token cleanup job failed:', err.message)
    }
  })

  logger.info('Cron jobs started successfully')
}