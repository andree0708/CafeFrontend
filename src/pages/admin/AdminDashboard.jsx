import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { Users, Leaf, Package, BarChart2, TrendingUp, ArrowRight } from 'lucide-react'
import { labelVariety } from '../../lib/labels'

const CAT_LABELS = {
  SPECIALTY: 'Especialidad',
  PREMIUM:   'Premium',
  COMMERCIAL:'Comercial',
  LOW_GRADE: 'Bajo grado',
}

const CAT_ACCENT = {
  SPECIALTY: 'bg-sage-500',
  PREMIUM:   'bg-roast',
  COMMERCIAL:'bg-amber-400',
  LOW_GRADE: 'bg-coral-400',
}

export default function AdminDashboard() {
  const { adminStats, allUsers, allBatches, loading } = useData()

  if (loading) return (
    <div className="flex items-center gap-2 text-muted py-12 animate-pulse">
      <span className="w-4 h-4 border-2 border-crema/30 border-t-crema rounded-full animate-spin" />
      Cargando…
    </div>
  )

  const done = allBatches.filter((b) => b.prediction?.status === 'DONE')

  return (
    <div className="space-y-10 animate-fade-up">

      {/* Header */}
      <div>
        <p className="page-kicker">Administración</p>
        <h1 className="page-title mt-2">Visión del sistema</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Productores"   value={adminStats.totalProducers}         accent="default" icon={Users}      />
        <StatCard title="Fincas"        value={adminStats.totalFarms}             accent="sage"    icon={Leaf}       />
        <StatCard title="Lotes"         value={adminStats.totalBatches}           accent="muted"   icon={Package}    />
        <StatCard title="Análisis IA"   value={adminStats.totalPredictions}       accent="amber"   icon={BarChart2}  />
        <StatCard title="Especialidad"  value={`${adminStats.specialtyPercentage}%`} accent="sage" icon={TrendingUp} />
        <StatCard title="Promedio SCA"  value={adminStats.avgScoreGlobal || '—'}  accent="default" icon={BarChart2}  />
      </div>

      {/* Quality distribution */}
      <div className="card">
        <h2 className="font-display text-xl mb-5">Distribución de calidad</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          {(['SPECIALTY', 'PREMIUM', 'COMMERCIAL', 'LOW_GRADE']).map((c) => {
            const n = allBatches.filter((b) => b.prediction?.qualityCategory === c).length
            const pct = done.length > 0 ? Math.round((n / done.length) * 100) : 0
            return (
              <div key={c} className="card-flat">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${CAT_ACCENT[c]}`} />
                  <p className="page-kicker">{CAT_LABELS[c]}</p>
                </div>
                <p className="font-display text-3xl text-ink">{n}</p>
                <div className="mt-2 h-1 bg-line rounded-full overflow-hidden">
                  <div className={`h-1 rounded-full ${CAT_ACCENT[c]} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted mt-1">{pct}% del total</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Producers table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-line">
          <h2 className="font-display text-xl">Productores</h2>
          <Link to="/admin/producers" className="btn-ghost text-xs">
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>
        {allUsers.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted">Aún no hay productores.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line bg-canvas">
                {['Productor', 'Correo', 'Fincas', 'Lotes'].map((h) => (
                  <th key={h} className="px-6 py-3 page-kicker font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {allUsers.slice(0, 6).map((p) => (
                <tr key={p.id} className="hover:bg-canvas transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-line flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-semibold text-muted uppercase">
                          {p.firstName?.[0]}{p.lastName?.[0]}
                        </span>
                      </div>
                      <span className="font-medium text-ink">{p.firstName} {p.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-muted">{p.email}</td>
                  <td className="px-6 py-3.5 font-display text-lg">{p.farms}</td>
                  <td className="px-6 py-3.5 font-display text-lg">{p.batches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent predictions */}
      <div className="card p-0 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-line">
          <h2 className="font-display text-xl">Últimos análisis</h2>
          <Link to="/admin/predictions" className="btn-ghost text-xs">
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>
        {done.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted">Aún no hay análisis completados.</p>
        ) : (
          <ul className="divide-y divide-line">
            {done.slice(0, 5).map((b) => (
              <li key={b.id} className="flex justify-between items-center px-6 py-4 hover:bg-canvas transition-colors">
                <div>
                  <p className="font-medium text-ink">{b.code}</p>
                  <p className="text-xs text-muted mt-0.5">{b.farmName} · {labelVariety(b.variety)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-2xl text-ink">{b.prediction.predictedScore}</span>
                  <Badge category={b.prediction.qualityCategory} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
