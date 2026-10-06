import { mockBatches } from '../../data/mockData'
import Badge from '../../components/ui/Badge'
import { Package } from 'lucide-react'

export default function AdminBatches() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lotes</h1>
        <p className="text-slate-500 mt-1 text-sm">Todos los lotes registrados en el sistema</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Código', 'Finca', 'Variedad', 'Proceso', 'Puntaje', 'Categoría'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockBatches.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-blue-400" />
                    <span className="font-medium text-slate-900 text-sm">{b.code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{b.farmName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{b.variety || '—'}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{b.processingMethod || '—'}</td>
                <td className="px-6 py-4">
                  {b.prediction.predictedScore
                    ? <span className="text-sm font-bold text-slate-900">{b.prediction.predictedScore} pts</span>
                    : <span className="text-sm text-slate-300">—</span>}
                </td>
                <td className="px-6 py-4"><Badge category={b.prediction.qualityCategory || 'PENDING'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
