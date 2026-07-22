// clinicSettings.controller.js — Clinic configuration management
import ClinicSettings from '../models/ClinicSettings.model.js'
import { logSettingsChange } from '../services/audit.service.js'

async function getOrCreateSettings() {
  let settings = await ClinicSettings.findOne()
  if (!settings) settings = await ClinicSettings.create({})
  return settings
}

// GET /api/clinic-settings
export async function getClinicSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings()

    if (!req.user || req.user.role !== 'admin') {
      return res.json({
        clinicName:    settings.clinicName,
        tagline:       settings.tagline,
        logo:          settings.logo,
        email:         settings.email,
        phone:         settings.phone,
        alternatePhone:settings.alternatePhone,
        website:       settings.website,
        address:       settings.address,
        workingHours:  settings.workingHours,
        socialMedia:   settings.socialMedia,
      })
    }

    res.json(settings)
  } catch (err) { next(err) }
}

// PATCH /api/clinic-settings (admin only)
export async function updateClinicSettings(req, res, next) {
  try {
    const settings      = await getOrCreateSettings()
    const previousData  = settings.toObject()

    const allowedFields = [
      'clinicName', 'tagline', 'logo',
      'email', 'phone', 'alternatePhone', 'website',
      'address', 'workingHours', 'socialMedia',
      'appointmentSettings', 'paymentSettings',
      'emailSettings', 'isMaintenanceMode', 'maintenanceMessage',
    ]

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] === 'object' &&
          !Array.isArray(req.body[field])
        ) {
          settings[field] = {
            ...(settings[field]?.toObject?.() ?? settings[field]),
            ...req.body[field],
          }
        } else {
          settings[field] = req.body[field]
        }
      }
    }

    await settings.save()
    await logSettingsChange(req.user, previousData, settings.toObject(), req)

    res.json({ message: 'Clinic settings updated successfully.', settings })
  } catch (err) { next(err) }
}

// GET /api/clinic-settings/payment-accounts (admin only)
export async function getPaymentAccounts(req, res, next) {
  try {
    const settings = await getOrCreateSettings()
    res.json(settings.paymentSettings)
  } catch (err) { next(err) }
}

// PATCH /api/clinic-settings/payment-accounts (admin only)
export async function updatePaymentAccounts(req, res, next) {
  try {
    const settings = await getOrCreateSettings()
    settings.paymentSettings = {
      ...(settings.paymentSettings?.toObject?.() ?? settings.paymentSettings),
      ...req.body,
    }
    await settings.save()
    res.json({
      message:         'Payment accounts updated successfully.',
      paymentSettings: settings.paymentSettings,
    })
  } catch (err) { next(err) }
}