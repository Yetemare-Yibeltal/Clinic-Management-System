// Avatar.jsx — User avatar with initials fallback
import { getImageUrl, getInitialsColor } from '../../utils/imageUtils.js'

export default function Avatar ({
  user,
  size = 'md',
  showName = false,
  className = ''
}) {
  const sizes = {
    xs: { div: 'w-6 h-6 text-xs', img: 24 },
    sm: { div: 'w-8 h-8 text-xs', img: 32 },
    md: { div: 'w-10 h-10 text-sm', img: 40 },
    lg: { div: 'w-14 h-14 text-base', img: 56 },
    xl: { div: 'w-20 h-20 text-xl', img: 80 },
    '2xl': { div: 'w-28 h-28 text-3xl', img: 112 }
  }

  const sizeConfig = sizes[size] || sizes.md
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const initials = user?.initials || name.charAt(0).toUpperCase()
  const avatarUrl = user?.avatar ? getImageUrl(user.avatar) : null
  const bgColor = getInitialsColor(name)

  const avatarEl = avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      width={sizeConfig.img}
      height={sizeConfig.img}
      className={`${sizeConfig.div} rounded-full object-cover flex-shrink-0 ${className}`}
    />
  ) : (
    <div
      className={`${sizeConfig.div} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
    >
      {initials}
    </div>
  )

  if (!showName) return avatarEl

  return (
    <div className='flex items-center gap-2'>
      {avatarEl}
      <div>
        <p className='text-sm font-medium text-white'>{name}</p>
        {user?.role && (
          <p
            className='text-xs capitalize'
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {user.role}
          </p>
        )}
      </div>
    </div>
  )
}
