import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { Package } from 'lucide-react'
import { formatDate, labelProcess, labelVariety } from '../../lib/labels'

export default function Batches() {
  const { batches, farms, loading } = useData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = batches.filter((b) => {
    const q = search.toLowerCase()
    const match = b.code.toLowerCase().includes(q) || (b.farmName || '').toLowerCase().includes(q) || (b.variety || '').toLowerCase().includes(q)
    const status = b.prediction?.status === 'DONE' ? 'DONE' : 'PENDING'
    return match && (filter === 'all' || filter === status)
  })

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="page-kicker">Trazabilidad</p>
          <h1 className="page-title mt-2">Lotes</h1>
        </div>
        <Link to="/farms" className="btn-secondary">Ir a fincas</Link>
      </div>

      {loading ? <p className="text-stone-500">Cargando…</p> : batches.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin lotes"
          body={farms.length === 0 ? 'Primero registra una finca.' : 'Entra a una finca y crea el primer lote.'}
          action={<Link to="/farms" className="btn-primary">{farms.length === 0 ? 'Registrar finca' : 'Abrir fincas'}</Link>}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <input className="input-field max-w-sm" placeholder="Buscar código, finca o variedad" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="flex border border-line">
              {[['all', 'Todos'], ['DONE', 'Analizados'], ['PENDING', 'Pendientes']].map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)} className={`px-3 py-2 text-xs ${filter === k ? 'bg-ink text-paper' : 'text-stone-600'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  {['Código', 'Finca', 'Variedad', 'Proceso', 'Cosecha', 'Puntaje', ''].map((h) => (
                    <th key={h} className="px-5 py-3 page-kicker font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-white/40">
                    <td className="px-5 py-3.5 font-medium">{b.code}</td>
                    <td className="px-5 py-3.5 text-stone-600">{b.farmName}</td>
                    <td className="px-5 py-3.5 text-stone-600">{labelVariety(b.variety)}</td>
                    <td className="px-5 py-3.5 text-stone-600">{labelProcess(b.processingMethod)}</td>
                    <td className="px-5 py-3.5 text-stone-600">{formatDate(b.harvestDate)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-lg">{b.prediction?.predictedScore ?? '—'}</span>
                        <Badge category={b.prediction?.qualityCategory || 'PENDING'} />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link to={`/batches/${b.id}`} className="underline underline-offset-4 text-xs">Detalle</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center py-10 text-stone-500 text-sm">Sin coincidencias</p>}
          </div>
        </>
      )}
    </div>
  )
}
