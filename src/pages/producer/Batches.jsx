import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { Package, Search, ArrowRight, Leaf } from 'lucide-react'
import { formatDate, labelProcess, labelVariety } from '../../lib/labels'

const FILTERS = [
  { k: 'all',     l: 'Todos'      },
  { k: 'DONE',    l: 'Analizados' },
  { k: 'PENDING', l: 'Pendientes' },
]

export default function Batches() {
  const { batches, farms, loading } = useData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = batches.filter((b) => {
    const q   = search.toLowerCase()
    const hit = b.code.toLowerCase().includes(q) || (b.farmName || '').toLowerCase().includes(q) || (b.variety || '').toLowerCase().includes(q)
    const st  = b.prediction?.status === 'DONE' ? 'DONE' : 'PENDING'
    return hit && (filter === 'all' || filter === st)
  })

  return (
    <div className="space-y-8 animate-fade-up">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="page-kicker">Trazabilidad</p>
          <h1 className="page-title mt-2">Lotes</h1>
        </div>
        <Link to="/farms" className="btn-secondary"><Leaf size={14} /> Ir a fincas</Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted animate-pulse">
          <span className="w-4 h-4 border-2 border-crema/30 border-t-crema rounded-full animate-spin" />
          Cargando…
        </div>
      ) : batches.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin lotes"
          body={farms.length === 0 ? 'Primero registra una finca.' : 'Entra a una finca y crea el primer lote.'}
          action={<Link to="/farms" className="btn-primary">{farms.length === 0 ? 'Registrar finca' : 'Abrir fincas'}</Link>}
        />
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="input-field pl-9"
                placeholder="Código, finca o variedad"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter pills */}
            <div className="flex gap-1 p-1 bg-line rounded-md">
              {FILTERS.map(({ k, l }) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    filter === k
                      ? 'bg-panel text-ink shadow-warm-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted ml-auto">
              {filtered.length} de {batches.length}
            </span>
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-canvas">
                    {['Código', 'Finca', 'Variedad', 'Proceso', 'Cosecha', 'Puntaje', ''].map((h) => (
                      <th key={h} className={`px-5 py-3 text-left page-kicker font-medium ${h === '' ? 'w-16' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-canvas/70 transition-colors group">
                      <td className="px-5 py-3.5 font-medium text-ink">{b.code}</td>
                      <td className="px-5 py-3.5 text-muted">{b.farmName}</td>
                      <td className="px-5 py-3.5 text-muted">{labelVariety(b.variety)}</td>
                      <td className="px-5 py-3.5 text-muted">{labelProcess(b.processingMethod)}</td>
                      <td className="px-5 py-3.5 text-muted">{formatDate(b.harvestDate)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {b.prediction?.predictedScore != null && (
                            <span className="font-display text-xl text-ink">{b.prediction.predictedScore}</span>
                          )}
                          <Badge category={b.prediction?.qualityCategory || 'PENDING'} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/batches/${b.id}`}
                          className="inline-flex items-center gap-1 text-xs text-espresso font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:text-roast"
                        >
                          Detalle <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted">
                  <Package size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sin coincidencias</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
