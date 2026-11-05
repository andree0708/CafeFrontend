import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { BarChart2 } from 'lucide-react'

export default function AdminPredictions() {
  const { allBatches, loading } = useData()
  const done = allBatches.filter((b) => b.prediction?.status === 'DONE')
  return (
    <div className="space-y-8">
      <div>
        <p className="page-kicker">Modelo</p>
        <h1 className="page-title mt-2">Análisis</h1>
      </div>
      {loading ? <p className="text-stone-500">Cargando…</p> : done.length === 0 ? (
        <EmptyState icon={BarChart2} title="Aún no hay predicciones" body="Cuando un productor analice un lote, el resultado aparece aquí." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {done.map((b) => (
            <article key={b.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{b.code}</p>
                  <p className="text-xs text-stone-500 mt-1">{b.farmName}</p>
                </div>
                <Badge category={b.prediction.qualityCategory} />
              </div>
              <p className="font-display text-5xl mt-4">{b.prediction.predictedScore}</p>
              <p className="text-xs text-stone-500 mt-2">Confianza {Math.round((b.prediction.confidenceLevel || 0) * 100)}%</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
