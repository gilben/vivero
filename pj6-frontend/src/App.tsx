import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import AdminLayout from '@/layouts/AdminLayout'
import HomePage from '@/pages/HomePage'
import CatalogoPage from '@/pages/CatalogoPage'
import ProductoDetallePage from '@/pages/ProductoDetallePage'
import LoginPage from '@/pages/LoginPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/catalogo', element: <CatalogoPage /> },
      { path: '/catalogo/:id', element: <ProductoDetallePage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/admin/login', element: <LoginPage /> },
      { path: '/admin/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [{ index: true, element: <AdminDashboardPage /> }],
  },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  )
}