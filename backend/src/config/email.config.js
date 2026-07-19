// email.config.js — Gmail SMTP configuration using Nodemailer
import nodemailer from 'nodemailer'
import { ENV } from './env.js'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
})

export async function verifyEmailConnection() {
  try {
    await transporter.verify()
    console.log('Email service connected: Gmail SMTP ready')
    return true
  } catch (err) {
    console.error('Email service connection failed:', err.message)
    return false
  }
}

export const EMAIL_DEFAULTS = {
  from:          `"Kidus Yared Healthcare" <${process.env.EMAIL_USER}>`,
  clinicName:    'Kidus Yared Healthcare',
  clinicEmail:   'info@kidusyared.et',
  clinicPhone:   '+251911223344',
  clinicAddress: 'Addis Ababa, Ethiopia',
  website:       'https://kidusyared.et',
}