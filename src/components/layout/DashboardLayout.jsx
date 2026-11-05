import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DataProvider } from '../../context/DataContext'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="font-display text-2xl text-ink">CaféIA</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <DataProvider user={user}>
      <div className="flex min-h-screen bg-paper">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-8 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </DataProvider>
  )
}
