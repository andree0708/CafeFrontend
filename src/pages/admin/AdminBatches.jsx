import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { Package } from 'lucide-react'
import { labelProcess, labelVariety } from '../../lib/labels'

export default function AdminBatches() {
  const { allBatches, loading } = useData()
  return (
    <div className="space-y-8">
      <div>
        <p className="page-kicker">Directorio</p>
        <h1 className="page-title mt-2">Lotes</h1>
      </div>
      {loading ? <p className="text-stone-500">Cargando…</p> : allBatches.length === 0 ? (
        <EmptyState icon={Package} title="Sin lotes" />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                {['Código', 'Finca', 'Variedad', 'Proceso', 'Puntaje', ''].map((h) => (
                  <th key={h} className="px-5 py-3 page-kicker font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {allBatches.map((b) => (
                <tr key={b.id}>
                  <td className="px-5 py-3 font-medium">{b.code}</td>
                  <td className="px-5 py-3 text-stone-600">{b.farmName}</td>
                  <td className="px-5 py-3">{labelVariety(b.variety)}</td>
                  <td className="px-5 py-3">{labelProcess(b.processingMethod)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg">{b.prediction?.predictedScore ?? '—'}</span>
                      <Badge category={b.prediction?.qualityCategory || 'PENDING'} />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/batches/${b.id}`} className="underline underline-offset-4 text-xs">Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
