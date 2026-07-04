import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-color)' }}>
      <div className="w-full max-w-md px-4"><Outlet /></div>
    </div>
  )
}