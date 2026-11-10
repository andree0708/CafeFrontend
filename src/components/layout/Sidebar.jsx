import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Leaf, Package, BarChart2,
  Users, Settings, LogOut, Map, ClipboardList,
  Cpu, GitCompare, Coffee,
} from 'lucide-react'
import clsx from 'clsx'

const producerNav = [
  { to: '/dashboard',   label: 'Resumen',   icon: LayoutDashboard },
  { to: '/farms',       label: 'Fincas',    icon: Leaf            },
  { to: '/batches',     label: 'Lotes',     icon: Package         },
  { to: '/predictions', label: 'Análisis',  icon: BarChart2       },
  { to: '/compare',     label: 'Comparar',  icon: GitCompare      },
  { to: '/model',       label: 'Modelo IA', icon: Cpu             },
]

const adminNav = [
  { to: '/admin',              label: 'Resumen',     icon: LayoutDashboard },
  { to: '/admin/producers',    label: 'Productores', icon: Users           },
  { to: '/admin/farms',        label: 'Fincas',      icon: Map             },
  { to: '/admin/batches',      label: 'Lotes',       icon: Package         },
  { to: '/admin/predictions',  label: 'Análisis',    icon: BarChart2       },
  { to: '/admin/reports',      label: 'Reportes',    icon: ClipboardList   },
  { to: '/compare',            label: 'Comparar',    icon: GitCompare      },
  { to: '/model',              label: 'Modelo IA',   icon: Cpu             },
]

const NAV_LABEL = { producer: 'Productor', admin: 'Administración' }

export default function Sidebar() {
  const { user, logout, displayName } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const nav = isAdmin ? adminNav : producerNav
  const initials = displayName
    ? displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside className="w-[232px] min-h-screen flex flex-col bg-roast text-paper/80 border-r border-roast/20">

      {/* ── Logo ────────────────────────────────────────────────────────── */}
      <div className="px-5 py-6 flex items-center gap-2.5 border-b border-paper/10">
        <div className="w-8 h-8 bg-crema rounded flex items-center justify-center shrink-0">
          <Coffee size={16} className="text-roast" />
        </div>
        <div>
          <p className="font-display text-lg text-paper leading-none">CaféIA</p>
          <p className="text-[9px] uppercase tracking-[0.2em] text-crema/70 mt-0.5">
            {isAdmin ? NAV_LABEL.admin : NAV_LABEL.producer}
          </p>
        </div>
      </div>

      {/* ── User ────────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 flex items-center gap-3 border-b border-paper/10">
        <div className="w-8 h-8 rounded-full bg-crema/20 border border-crema/30 flex items-center justify-center shrink-0">
          <span className="text-crema text-xs font-semibold leading-none">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-paper truncate leading-tight">{displayName}</p>
          <p className="text-[10px] text-paper/40 truncate mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              clsx(
                'group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
                isActive
                  ? 'bg-crema text-roast font-semibold shadow-warm-sm'
                  : 'text-paper/60 hover:text-paper hover:bg-paper/8'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={clsx(
                    'shrink-0 transition-colors',
                    isActive ? 'text-roast' : 'text-paper/40 group-hover:text-paper/80'
                  )}
                />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-paper/10 space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
              isActive ? 'bg-crema text-roast font-semibold' : 'text-paper/60 hover:text-paper hover:bg-paper/8'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={16} className={isActive ? 'text-roast' : 'text-paper/40'} />
              <span>Cuenta</span>
            </>
          )}
        </NavLink>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-paper/60 hover:text-coral-300 hover:bg-coral-900/20 transition-all duration-150"
        >
          <LogOut size={16} className="text-paper/40" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
