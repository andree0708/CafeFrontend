import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'
import { Leaf } from 'lucide-react'
import { formatDate, labelVariety } from '../../lib/labels'

export default function Dashboard() {
  const { displayName } = useAuth()
  const { farms, batches, loading } = useData()
  const first = displayName?.split(' ')[0] || ''
  const done = batches.filter((b) => b.prediction?.status === 'DONE')
  const specialty = batches.filter((b) => b.prediction?.qualityCategory === 'SPECIALTY')
  const pending = batches.filter((b) => b.prediction?.status !== 'DONE')
  const avg = done.length
    ? (done.reduce((a, b) => a + b.prediction.predictedScore, 0) / done.length).toFixed(1)
    : '—'

  if (loading) return <p className="text-stone-500">Cargando resumen…</p>

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-kicker">Panel del productor</p>
          <h1 className="page-title mt-2">Resumen, {first}</h1>
        </div>
        <Link to="/farms" className="btn-primary">Nueva finca</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Fincas" value={farms.length} subtitle="Registradas" />
        <StatCard title="Lotes" value={batches.length} subtitle="En trazabilidad" />
        <StatCard title="Especialidad" value={specialty.length} subtitle="Score ≥ 85" />
        <StatCard title="Promedio SCA" value={avg} subtitle={`${pending.length} sin analizar`} />
      </div>

      {farms.length === 0 ? (
        <EmptyState
          icon={Leaf}
          title="Empieza por una finca"
          body="Sin finca no hay lote, y sin lote el modelo no tiene qué puntuar."
          action={<Link to="/farms" className="btn-primary">Registrar finca</Link>}
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h2 className="font-display text-xl">Últimos lotes</h2>
            <Link to="/batches" className="text-sm underline underline-offset-4">Ver todos</Link>
          </div>
          {batches.length === 0 ? (
            <p className="px-6 py-10 text-sm text-stone-500">Aún no hay lotes. Ábrelos desde una finca.</p>
          ) : (
            <ul className="divide-y divide-line">
              {batches.slice(0, 6).map((b) => (
                <li key={b.id}>
                  <Link to={`/batches/${b.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-white/50">
                    <div>
                      <p className="font-medium">{b.code}</p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {b.farmName} · {labelVariety(b.variety)} · {formatDate(b.harvestDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {b.prediction?.predictedScore != null && (
                        <span className="font-display text-xl">{b.prediction.predictedScore}</span>
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
    </div>
  )
}
