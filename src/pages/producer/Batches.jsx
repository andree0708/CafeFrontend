import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockBatches, mockFarms } from '../../data/mockData'
import Badge from '../../components/ui/Badge'
import { Package, Plus, Search, Calendar, Weight } from 'lucide-react'

export default function Batches() {
  const [batches] = useState(mockBatches)
  const [search, setSearch] = useState('')

  const filtered = batches.filter(
    (b) =>
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.farmName.toLowerCase().includes(search.toLowerCase()) ||
      (b.variety || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Lotes</h1>
          <p className="text-gray-500 mt-1">{batches.length} lote{batches.length !== 1 ? 's' : ''} registrado{batches.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/batches/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo lote
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por código, finca o variedad..."
          className="input-field pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Código</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Finca</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Variedad</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Proceso</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Puntaje</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Categoría</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-coffee-400" />
                      <span className="font-medium text-gray-900 text-sm">{batch.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.farmName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.variety || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.processingMethod || '—'}</td>
                  <td className="px-6 py-4">
                    {batch.prediction.predictedScore ? (
                      <span className="text-sm font-bold text-gray-900">{batch.prediction.predictedScore} pts</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge category={batch.prediction.qualityCategory || 'PENDING'} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/batches/${batch.id}`}
                      className="text-sm text-coffee-600 hover:underline font-medium"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package size={32} className="mx-auto mb-2" />
              <p>No se encontraron lotes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
