import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Leaf, Package, BarChart2,
  Users, Settings, LogOut, Coffee, ShieldCheck,
  Map, ClipboardList,
} from 'lucide-react'
import clsx from 'clsx'

const producerNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/farms', label: 'Mis Fincas', icon: Leaf },
  { to: '/batches', label: 'Mis Lotes', icon: Package },
  { to: '/predictions', label: 'Predicciones', icon: BarChart2 },
]

const adminNav = [
  { to: '/admin', label: 'Panel General', icon: LayoutDashboard },
  { to: '/admin/producers', label: 'Productores', icon: Users },
  { to: '/admin/farms', label: 'Fincas', icon: Map },
  { to: '/admin/batches', label: 'Lotes', icon: Package },
  { to: '/admin/predictions', label: 'Predicciones', icon: BarChart2 },
  { to: '/admin/reports', label: 'Reportes', icon: ClipboardList },
]

// ── Theme per role ────────────────────────────────────────────────────────────
const producerTheme = {
  sidebar: 'bg-coffee-950',
  border: 'border-coffee-800',
  logoBox: 'bg-coffee-600',
  activeLink: 'bg-coffee-600 text-white',
  inactiveLink: 'text-coffee-300 hover:bg-coffee-800 hover:text-white',
  username: 'text-white',
  userRole: 'text-coffee-400',
  avatarBg: 'bg-coffee-600',
  footerBorder: 'border-coffee-800',
  footerLink: 'text-coffee-300 hover:bg-coffee-800 hover:text-white',
  logoutHover: 'hover:bg-red-900 hover:text-red-300',
  logoutText: 'text-coffee-300',
  badge: 'bg-coffee-800 text-coffee-200',
  badgeLabel: 'Productor',
}

const adminTheme = {
  sidebar: 'bg-slate-900',
  border: 'border-slate-700',
  logoBox: 'bg-blue-600',
  activeLink: 'bg-blue-600 text-white',
  inactiveLink: 'text-slate-300 hover:bg-slate-700 hover:text-white',
  username: 'text-white',
  userRole: 'text-slate-400',
  avatarBg: 'bg-blue-600',
  footerBorder: 'border-slate-700',
  footerLink: 'text-slate-300 hover:bg-slate-700 hover:text-white',
  logoutHover: 'hover:bg-red-900 hover:text-red-300',
  logoutText: 'text-slate-300',
  badge: 'bg-slate-700 text-slate-200',
  badgeLabel: 'Administrador',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const nav = isAdmin ? adminNav : producerNav
  const t = isAdmin ? adminTheme : producerTheme

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`w-64 min-h-screen ${t.sidebar} flex flex-col`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-6 py-5 border-b ${t.border}`}>
        <div className={`p-2 ${t.logoBox} rounded-lg`}>
          {isAdmin
            ? <ShieldCheck size={20} className="text-white" />
            : <Coffee size={20} className="text-white" />}
        </div>
        <div>
          <p className="text-white font-bold text-sm">CaféIA</p>
          <p className={`text-xs ${t.userRole}`}>
            {isAdmin ? 'Panel Administrativo' : 'Panel Productor'}
          </p>
        </div>
      </div>

      {/* User info */}
      <div className={`px-6 py-4 border-b ${t.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${t.avatarBg} flex items-center justify-center shrink-0`}>
            <span className="text-white text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className={`${t.username} text-sm font-medium truncate`}>{user?.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded ${t.badge}`}>
              {t.badgeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? t.activeLink : t.inactiveLink
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={`px-3 py-4 border-t ${t.footerBorder} space-y-0.5`}>
        <NavLink
          to="/settings"
          className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', t.footerLink)}
        >
          <Settings size={17} />
          Configuración
        </NavLink>
        <button
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            t.logoutText, t.logoutHover
          )}
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
