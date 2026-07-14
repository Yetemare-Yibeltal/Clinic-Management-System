// file.utils.js — Server-side file operation utilities
import fs   from 'fs'
import path from 'path'

const UPLOAD_DIR = path.resolve('uploads')

// ── Delete a file from the uploads folder ─────────────
// Input:  "/uploads/avatar-123456789.jpg"
// Safely ignores if file doesn't exist
export function deleteFile(filePath) {
  if (!filePath) return

  try {
    // Strip the leading /uploads/ to get just the filename
    const filename    = path.basename(filePath)
    const absolutePath = path.join(UPLOAD_DIR, filename)

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath)
    }
  } catch (err) {
    console.error('Failed to delete file:', err.message)
  }
}

// ── Check if a file exists ─────────────────────────────
export function fileExists(filePath) {
  if (!filePath) return false
  try {
    const filename     = path.basename(filePath)
    const absolutePath = path.join(UPLOAD_DIR, filename)
    return fs.existsSync(absolutePath)
  } catch {
    return false
  }
}

// ── Get file size in human readable format ─────────────
// Input:  "/uploads/avatar-123.jpg"
// Output: "245 KB"
export function getFileSize(filePath) {
  try {
    const filename     = path.basename(filePath)
    const absolutePath = path.join(UPLOAD_DIR, filename)
    const stats        = fs.statSync(absolutePath)
    const bytes        = stats.size

    if (bytes < 1024)                    return `${bytes} B`
    if (bytes < 1024 * 1024)             return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024)     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  } catch {
    return 'Unknown'
  }
}

// ── Get file extension ─────────────────────────────────
// Input:  "avatar-123.jpg"
// Output: ".jpg"
export function getFileExtension(filename) {
  return path.extname(filename).toLowerCase()
}

// ── Check if file type is allowed image ───────────────
export function isAllowedImageType(mimetype) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return allowed.includes(mimetype)
}

// ── Check if file type is allowed document ────────────
export function isAllowedDocumentType(mimetype) {
  const allowed = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  return allowed.includes(mimetype)
}

// ── Build public URL for an uploaded file ─────────────
// Input:  "/uploads/avatar-123.jpg", "http://localhost:5000"
// Output: "http://localhost:5000/uploads/avatar-123.jpg"
export function buildFileUrl(filePath, baseUrl) {
  if (!filePath) return null
  if (!baseUrl)  return filePath
  return `${baseUrl}${filePath}`
}

// ── Replace old file with new one ─────────────────────
// Deletes the old file and returns the new file path
// Used when updating avatars or documents
export function replaceFile(oldFilePath, newFilePath) {
  if (oldFilePath && oldFilePath !== newFilePath) {
    deleteFile(oldFilePath)
  }
  return newFilePath
}