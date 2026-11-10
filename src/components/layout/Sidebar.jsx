import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Leaf, Package, BarChart2,
  Users, Settings, LogOut, Map, ClipboardList, Cpu, GitCompare,
} from 'lucide-react'
import clsx from 'clsx'

const producerNav = [
  { to: '/dashboard', label: 'Resumen' },
  { to: '/farms', label: 'Fincas' },
  { to: '/batches', label: 'Lotes' },
  { to: '/predictions', label: 'Análisis' },
  { to: '/compare', label: 'Comparar' },
  { to: '/model', label: 'Modelo IA' },
]

const adminNav = [
  { to: '/admin', label: 'Resumen' },
  { to: '/admin/producers', label: 'Productores' },
  { to: '/admin/farms', label: 'Fincas' },
  { to: '/admin/batches', label: 'Lotes' },
  { to: '/admin/predictions', label: 'Análisis' },
  { to: '/admin/reports', label: 'Reportes' },
  { to: '/compare', label: 'Comparar' },
  { to: '/model', label: 'Modelo IA' },
]

const icons = {
  '/dashboard': LayoutDashboard,
  '/farms': Leaf,
  '/batches': Package,
  '/predictions': BarChart2,
  '/compare': GitCompare,
  '/model': Cpu,
  '/admin': LayoutDashboard,
  '/admin/producers': Users,
  '/admin/farms': Map,
  '/admin/batches': Package,
  '/admin/predictions': BarChart2,
  '/admin/reports': ClipboardList,
}

export default function Sidebar() {
  const { user, logout, displayName } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const nav = isAdmin ? adminNav : producerNav

  return (
    <aside className="w-[240px] min-h-screen border-r border-line bg-panel flex flex-col">
      <div className="px-6 py-7 border-b border-line">
        <p className="font-display text-2xl text-ink leading-none">CaféIA</p>
        <p className="page-kicker mt-2">{isAdmin ? 'Administración' : 'Laboratorio de calidad'}</p>
      </div>

      <div className="px-6 py-5 border-b border-line">
        <p className="text-sm font-medium text-ink truncate">{displayName}</p>
        <p className="text-xs text-stone-500 mt-0.5 truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, label }) => {
          const Icon = icons[to]
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard' || to === '/admin'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-stone-600 hover:text-ink hover:bg-white/60'
                )
              }
            >
              {Icon && <Icon size={16} />}
              {label}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-line space-y-0.5">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-ink hover:bg-white/60"
        >
          <Settings size={16} />
          Cuenta
        </NavLink>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-ink hover:bg-white/60"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
