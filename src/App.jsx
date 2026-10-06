import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// General
import Welcome from './pages/Welcome'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Producer
import Dashboard from './pages/producer/Dashboard'
import Farms from './pages/producer/Farms'
import FarmDetail from './pages/producer/FarmDetail'
import Batches from './pages/producer/Batches'
import BatchDetail from './pages/producer/BatchDetail'
import Predictions from './pages/producer/Predictions'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducers from './pages/admin/AdminProducers'
import AdminFarms from './pages/admin/AdminFarms'
import AdminBatches from './pages/admin/AdminBatches'
import AdminPredictions from './pages/admin/AdminPredictions'
import AdminReports from './pages/admin/AdminReports'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — all share DashboardLayout + DataProvider */}
        <Route element={<DashboardLayout />}>
          {/* Onboarding (producer only) */}
          <Route path="/welcome" element={<Welcome />} />

          {/* Producer */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/farms/:id" element={<FarmDetail />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/batches/:id" element={<BatchDetail />} />
          <Route path="/predictions" element={<Predictions />} />

          {/* Shared */}
          <Route path="/settings" element={<Settings />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/producers" element={<AdminProducers />} />
          <Route path="/admin/farms" element={<AdminFarms />} />
          <Route path="/admin/batches" element={<AdminBatches />} />
          <Route path="/admin/predictions" element={<AdminPredictions />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
