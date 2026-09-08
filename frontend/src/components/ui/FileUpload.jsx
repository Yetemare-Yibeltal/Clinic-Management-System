// FileUpload.jsx — Drag and drop file upload with preview
import { useState, useRef } from 'react'
import { validateImageFile } from '../../utils/imageUtils.js'
import { formatFileSize } from '../../utils/formatters.js'

export default function FileUpload ({
  onFileSelect,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Upload File',
  hint = 'JPG, PNG or WEBP up to 5MB',
  error = '',
  preview = null,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState('')
  const [localPreview, setLocalPreview] = useState(null)
  const inputRef = useRef(null)

  const handleFile = file => {
    if (!file) return
    setFileError('')

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setFileError(validation.errors[0])
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setLocalPreview(previewUrl)
    onFileSelect?.(file, previewUrl)
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = e => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const displayError = error || fileError
  const displayPreview = localPreview || preview

  return (
    <div className={className}>
      {label && (
        <p
          className='text-sm font-medium mb-2'
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {label}
        </p>
      )}

      <div
        onDragOver={e => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className='relative flex flex-col items-center justify-center gap-3 rounded-xl p-8 cursor-pointer transition-all duration-200'
        style={{
          background: isDragging
            ? 'rgba(37,99,235,0.1)'
            : 'rgba(255,255,255,0.03)',
          border: `2px dashed ${
            isDragging
              ? 'rgba(37,99,235,0.6)'
              : displayError
              ? 'rgba(239,68,68,0.4)'
              : 'rgba(255,255,255,0.15)'
          }`
        }}
      >
        {displayPreview ? (
          <div className='relative'>
            <img
              src={displayPreview}
              alt='Preview'
              className='w-24 h-24 rounded-full object-cover'
              style={{ border: '3px solid rgba(37,99,235,0.4)' }}
            />
            <div
              className='absolute inset-0 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity'
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <span className='text-white text-sm'>Change</span>
            </div>
          </div>
        ) : (
          <>
            <div
              className='w-14 h-14 rounded-xl flex items-center justify-center text-2xl'
              style={{
                background: 'rgba(37,99,235,0.15)',
                border: '1px solid rgba(37,99,235,0.3)'
              }}
            >
              📁
            </div>
            <div className='text-center'>
              <p className='text-sm text-white/70'>
                <span className='text-blue-400 font-medium'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p
                className='text-xs mt-1'
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {hint}
              </p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type='file'
          accept={accept}
          onChange={handleInputChange}
          className='hidden'
        />
      </div>

      {displayError && (
        <p className='text-xs text-red-400 mt-1.5'>⚠ {displayError}</p>
      )}
    </div>
  )
}
