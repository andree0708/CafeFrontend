import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Leaf, Package, BarChart2,
  Users, Settings, LogOut, Coffee, ShieldCheck,
} from 'lucide-react'
import clsx from 'clsx'

const producerNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/farms', label: 'Mis Fincas', icon: Leaf },
  { to: '/batches', label: 'Mis Lotes', icon: Package },
  { to: '/predictions', label: 'Predicciones', icon: BarChart2 },
]

const adminNav = [
  { to: '/admin', label: 'Dashboard Admin', icon: ShieldCheck },
  { to: '/admin/producers', label: 'Productores', icon: Users },
  { to: '/admin/farms', label: 'Fincas', icon: Leaf },
  { to: '/admin/batches', label: 'Lotes', icon: Package },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = user?.role === 'ADMIN' ? adminNav : producerNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-coffee-950 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-coffee-800">
        <div className="p-2 bg-coffee-600 rounded-lg">
          <Coffee size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">CaféIA</p>
          <p className="text-coffee-400 text-xs">Sistema Inteligente</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-coffee-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-coffee-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-coffee-400 text-xs">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Productor'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-coffee-600 text-white'
                  : 'text-coffee-300 hover:bg-coffee-800 hover:text-white'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-coffee-800 space-y-1">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-coffee-300 hover:bg-coffee-800 hover:text-white transition-colors"
        >
          <Settings size={18} />
          Configuración
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-coffee-300 hover:bg-red-900 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
