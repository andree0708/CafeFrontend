import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import DashboardLayout from './components/layout/DashboardLayout'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Producer
import Dashboard from './pages/producer/Dashboard'
import Farms from './pages/producer/Farms'
import Batches from './pages/producer/Batches'
import Predictions from './pages/producer/Predictions'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'

// General
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Producer routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/predictions" element={<Predictions />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
