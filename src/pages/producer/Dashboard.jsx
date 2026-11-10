import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'
import { Leaf, ArrowRight, TrendingUp, Zap } from 'lucide-react'
import { formatDate, labelVariety } from '../../lib/labels'

export default function Dashboard() {
  const { displayName } = useAuth()
  const { farms, batches, loading } = useData()
  const first    = displayName?.split(' ')[0] || ''
  const done     = batches.filter((b) => b.prediction?.status === 'DONE')
  const specialty = batches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY')
  const pending  = batches.filter((b) => b.prediction?.status !== 'DONE')
  const avg      = done.length
    ? (done.reduce((a, b) => a + b.prediction.predictedScore, 0) / done.length).toFixed(1)
    : null

  if (loading) return (
    <div className="flex items-center gap-2 text-muted py-12 animate-pulse">
      <span className="w-4 h-4 border-2 border-crema/30 border-t-crema rounded-full animate-spin" />
      Cargando…
    </div>
  )

  return (
    <div className="space-y-10 animate-fade-up">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="page-kicker">Panel del productor</p>
          <h1 className="page-title mt-2">
            {first ? `Bienvenido, ${first}` : 'Resumen'}
          </h1>
        </div>
        <Link to="/farms" className="btn-primary">
          <Leaf size={14} /> Nueva finca
        </Link>
      </div>

      {/* ── Stats grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fincas"
          value={farms.length}
          subtitle="Registradas"
          accent="default"
          icon={Leaf}
        />
        <StatCard
          title="Lotes"
          value={batches.length}
          subtitle="En trazabilidad"
          accent="muted"
        />
        <StatCard
          title="Especialidad"
          value={specialty.length}
          subtitle="Score ≥ 85"
          accent="sage"
          icon={TrendingUp}
        />
        <StatCard
          title="Promedio SCA"
          value={avg ?? '—'}
          subtitle={pending.length > 0 ? `${pending.length} sin analizar` : 'Al día'}
          accent={avg && Number(avg) >= 85 ? 'sage' : avg ? 'amber' : 'muted'}
          icon={Zap}
        />
      </div>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {farms.length === 0 ? (
        <EmptyState
          icon={Leaf}
          title="Empieza por una finca"
          body="Sin finca no hay lote, y sin lote el modelo no tiene qué puntuar."
          action={<Link to="/farms" className="btn-primary">Registrar primera finca</Link>}
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h2 className="font-display text-xl text-ink">Últimos lotes</h2>
            <Link to="/batches" className="btn-ghost text-xs">
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>

          {batches.length === 0 ? (
            <p className="px-6 py-10 text-sm text-muted">Aún no hay lotes. Ábrelos desde una finca.</p>
          ) : (
            <ul className="divide-y divide-line">
              {batches.slice(0, 6).map((b) => (
                <li key={b.id}>
                  <Link
                    to={`/batches/${b.id}`}
                    className="group flex items-center justify-between px-6 py-4 hover:bg-canvas transition-colors"
                  >
                    <div>
                      <p className="font-medium text-ink group-hover:text-espresso transition-colors">
                        {b.code}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {b.farmName}
                        {b.variety ? ` · ${labelVariety(b.variety)}` : ''}
                        {b.harvestDate ? ` · ${formatDate(b.harvestDate)}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {b.prediction?.predictedScore != null && (
                        <span className="font-display text-2xl text-ink">{b.prediction.predictedScore}</span>
                      )}
                      <Badge category={b.prediction?.qualityCategory || 'PENDING'} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Quick actions ─────────────────────────────────────────────── */}
      {farms.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/predictions"
            className="card flex items-center justify-between gap-4 hover:shadow-warm transition-shadow group"
          >
            <div>
              <p className="page-kicker">IA</p>
              <p className="font-display text-xl mt-1">Solicitar análisis</p>
              <p className="text-xs text-muted mt-1">
                {pending.length} lote{pending.length === 1 ? '' : 's'} esperando predicción
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-crema/20 flex items-center justify-center shrink-0 group-hover:bg-crema/40 transition-colors">
              <Zap size={18} className="text-crema" />
            </div>
          </Link>

          <Link
            to="/farms"
            className="card flex items-center justify-between gap-4 hover:shadow-warm transition-shadow group"
          >
            <div>
              <p className="page-kicker">Trazabilidad</p>
              <p className="font-display text-xl mt-1">Gestionar fincas</p>
              <p className="text-xs text-muted mt-1">
                {farms.length} finca{farms.length === 1 ? '' : 's'} registrada{farms.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center shrink-0 group-hover:bg-sage-200 transition-colors">
              <Leaf size={18} className="text-sage-600" />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
