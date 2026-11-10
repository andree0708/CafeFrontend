import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Welcome from './pages/Welcome'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

import Dashboard from './pages/producer/Dashboard'
import Farms from './pages/producer/Farms'
import FarmDetail from './pages/producer/FarmDetail'
import Batches from './pages/producer/Batches'
import BatchDetail from './pages/producer/BatchDetail'
import Predictions from './pages/producer/Predictions'
import ModelInfo from './pages/producer/ModelInfo'
import Compare from './pages/producer/Compare'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducers from './pages/admin/AdminProducers'
import AdminFarms from './pages/admin/AdminFarms'
import AdminBatches from './pages/admin/AdminBatches'
import AdminPredictions from './pages/admin/AdminPredictions'
import AdminReports from './pages/admin/AdminReports'

function Guest({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (user) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Guest><Login /></Guest>} />
        <Route path="/register" element={<Guest><Register /></Guest>} />

        <Route element={<DashboardLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/farms/:id" element={<FarmDetail />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/batches/:id" element={<BatchDetail />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/model" element={<ModelInfo />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/producers" element={<AdminProducers />} />
          <Route path="/admin/farms" element={<AdminFarms />} />
          <Route path="/admin/batches" element={<AdminBatches />} />
          <Route path="/admin/predictions" element={<AdminPredictions />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
