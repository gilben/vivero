import { useAuthStore } from '@/store/authStore'

export default function AdminDashboardPage() {
  const user = useAuthStore(s => s.user)

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-ink">Panel de administración</h1>
      <p className="text-muted">
        Hola{user ? `, ${user.name}` : ''}. Bienvenido al catálogo del vivero.
      </p>
    </section>
  )
}