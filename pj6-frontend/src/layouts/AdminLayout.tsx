import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function AdminLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-line flex flex-col">
        <div className="p-6 font-semibold text-primary">Admin</div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="border-b border-line px-6 py-4" />
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  )
}