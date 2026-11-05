import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { labelVariety } from '../../lib/labels'

export default function AdminDashboard() {
  const { adminStats, allUsers, allBatches, loading } = useData()
  if (loading) return <p className="text-stone-500">Cargando…</p>

  const cats = ['SPECIALTY', 'PREMIUM', 'COMMERCIAL', 'LOW_GRADE']
  const catLabels = { SPECIALTY: 'Especialidad', PREMIUM: 'Premium', COMMERCIAL: 'Comercial', LOW_GRADE: 'Bajo grado' }

  return (
    <div className="space-y-10">
      <div>
        <p className="page-kicker">Administración</p>
        <h1 className="page-title mt-2">Visión del sistema</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Productores" value={adminStats.totalProducers} />
        <StatCard title="Fincas" value={adminStats.totalFarms} />
        <StatCard title="Lotes" value={adminStats.totalBatches} />
        <StatCard title="Análisis" value={adminStats.totalPredictions} />
        <StatCard title="Especialidad" value={`${adminStats.specialtyPercentage}%`} />
        <StatCard title="Promedio SCA" value={adminStats.avgScoreGlobal || '—'} />
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {cats.map((c) => {
          const n = allBatches.filter((b) => b.prediction?.qualityCategory === c).length
          return (
            <div key={c} className="card">
              <p className="page-kicker">{catLabels[c]}</p>
              <p className="font-display text-3xl mt-2">{n}</p>
            </div>
          )
        })}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display text-xl">Productores</h2>
          <Link to="/admin/producers" className="text-sm underline underline-offset-4">Ver todos</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-line">
              {['Nombre', 'Correo', 'Fincas', 'Lotes'].map((h) => <th key={h} className="px-6 py-3 page-kicker font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {allUsers.slice(0, 6).map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-3">{p.firstName} {p.lastName}</td>
                <td className="px-6 py-3 text-stone-500">{p.email}</td>
                <td className="px-6 py-3">{p.farms}</td>
                <td className="px-6 py-3">{p.batches}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {allUsers.length === 0 && <p className="px-6 py-8 text-sm text-stone-500">Aún no hay productores.</p>}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display text-xl">Últimos análisis</h2>
          <Link to="/admin/predictions" className="text-sm underline underline-offset-4">Ver todos</Link>
        </div>
        <ul className="divide-y divide-line">
          {allBatches.filter((b) => b.prediction?.status === 'DONE').slice(0, 5).map((b) => (
            <li key={b.id} className="flex justify-between items-center px-6 py-3">
              <div>
                <p className="font-medium text-sm">{b.code}</p>
                <p className="text-xs text-stone-500">{b.farmName} · {labelVariety(b.variety)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-xl">{b.prediction.predictedScore}</span>
                <Badge category={b.prediction.qualityCategory} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
