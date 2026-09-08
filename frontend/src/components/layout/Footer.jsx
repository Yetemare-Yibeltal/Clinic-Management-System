// Footer.jsx — Simple footer for auth pages
export default function Footer () {
  return (
    <footer className='text-center py-6'>
      <p className='text-xs' style={{ color: 'rgba(255,255,255,0.3)' }}>
        © {new Date().getFullYear()} Kidus Yared Healthcare. All rights
        reserved.
      </p>
      <p className='text-xs mt-1' style={{ color: 'rgba(255,255,255,0.2)' }}>
        v1.0.0 — Built for Kidus Yared Healthcare, Addis Ababa, Ethiopia
      </p>
    </footer>
  )
}
