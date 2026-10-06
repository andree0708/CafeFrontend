import { mockBatches } from '../../data/mockData'
import Badge from '../../components/ui/Badge'
import { BarChart2 } from 'lucide-react'

export default function AdminPredictions() {
  const done = mockBatches.filter((b) => b.prediction.status === 'DONE')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Predicciones</h1>
        <p className="text-slate-500 mt-1 text-sm">{done.length} análisis completados</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {done.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-900">{b.code}</p>
                <p className="text-xs text-slate-400">{b.farmName}</p>
              </div>
              <Badge category={b.prediction.qualityCategory} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-500" />
                <span className="text-2xl font-black text-slate-900">{b.prediction.predictedScore}</span>
                <span className="text-xs text-slate-400">pts</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Confianza</span>
                  <span>{Math.round(b.prediction.confidenceLevel * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div className="h-1.5 bg-blue-500 rounded-full"
                    style={{ width: `${b.prediction.confidenceLevel * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
