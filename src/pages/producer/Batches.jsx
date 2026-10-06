import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import { Package, Search, Leaf, Coffee, SlidersHorizontal } from 'lucide-react'

const STATUS_LABELS = {
  all: 'Todos',
  DONE: 'Analizados',
  PENDING: 'Pendientes',
}

export default function Batches() {
  const { batches, farms } = useData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = batches.filter((b) => {
    const matchSearch =
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      (b.farmName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.variety || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || b.prediction?.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Lotes</h1>
          <p className="text-gray-400 mt-0.5 text-sm">
            {batches.length === 0
              ? 'Ningún lote registrado aún'
              : `${batches.length} lote${batches.length !== 1 ? 's' : ''} en total`}
          </p>
        </div>
        {farms.length > 0 && (
          <Link to="/farms" className="btn-secondary text-sm flex items-center gap-1.5">
            <Leaf size={14} /> Ir a fincas
          </Link>
        )}
      </div>

      {batches.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-16 px-6">
          <div className="w-14 h-14 bg-coffee-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={26} className="text-coffee-500" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">Aún no tienes lotes</p>
          <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
            {farms.length === 0
              ? 'Primero registra una finca para poder agregar lotes.'
              : 'Entra a una finca y registra tu primer lote de café.'}
          </p>
          <Link to="/farms" className="btn-primary text-sm inline-block">
            {farms.length === 0 ? 'Registrar finca' : 'Ir a mis fincas'}
          </Link>
        </div>
      ) : (
        <>
          {/* Filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código, finca o variedad..."
                className="input-field pl-8 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 bg-gray-50">Código</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 bg-gray-50">Finca</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 bg-gray-50 hidden sm:table-cell">Variedad</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 bg-gray-50 hidden md:table-cell">Proceso</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 bg-gray-50">Puntaje</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 bg-gray-50">Categoría</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-coffee-50 rounded-lg flex items-center justify-center shrink-0">
                            <Package size={13} className="text-coffee-500" />
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{batch.code}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Leaf size={11} className="text-green-500 shrink-0" />
                          <span className="truncate max-w-28">{batch.farmName || '—'}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 hidden sm:table-cell">
                        {batch.variety || <span className="text-gray-200">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">
                        {batch.processingMethod || <span className="text-gray-200">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        {batch.prediction?.predictedScore ? (
                          <span className="text-sm font-bold text-gray-900">{batch.prediction.predictedScore}<span className="text-gray-400 font-normal text-xs"> pts</span></span>
                        ) : (
                          <span className="text-gray-200 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge category={batch.prediction?.qualityCategory || 'PENDING'} />
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/batches/${batch.id}`}
                          className="text-xs text-coffee-600 hover:text-coffee-700 font-medium hover:underline whitespace-nowrap"
                        >
                          Ver detalle →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <Coffee size={28} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-gray-400 text-sm">No se encontraron lotes</p>
                  {search && (
                    <button onClick={() => setSearch('')} className="text-coffee-600 text-xs hover:underline mt-1">
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer count */}
            {filtered.length > 0 && (
              <div className="px-5 py-2.5 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400">
                  Mostrando {filtered.length} de {batches.length} lote{batches.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
