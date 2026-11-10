import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { GitCompare, Check } from 'lucide-react'
import { formatDate, labelMarket, labelVariety } from '../../lib/labels'

const MAX_SELECTION = 4

export default function Compare() {
  const { batches, fetchBatch, loading } = useData()
  const [selectedIds, setSelectedIds] = useState([])
  const [details, setDetails] = useState({})
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Preselect up to three already-analyzed lots.
  useEffect(() => {
    if (batches.length === 0) return
    setSelectedIds((current) => {
      if (current.length > 0) return current
      return batches
        .filter((batch) => batch.prediction?.status === 'DONE')
        .slice(0, 3)
        .map((batch) => batch.id)
    })
  }, [batches])

  const selectionKey = selectedIds.join(',')

  useEffect(() => {
    const missing = selectedIds.filter((id) => !details[id])
    if (missing.length === 0) return

    let active = true
    setLoadingDetails(true)
    Promise.all(
      missing.map((id) =>
        fetchBatch(id)
          .then((detail) => [id, detail])
          .catch(() => [id, null])
      )
    )
      .then((entries) => {
        if (active) setDetails((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
      })
      .finally(() => {
        if (active) setLoadingDetails(false)
      })

    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionKey])

  const selectedDetails = useMemo(
    () => selectedIds.map((id) => details[id]).filter(Boolean),
    [selectedIds, details]
  )

  const toggle = (id) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= MAX_SELECTION) return current
      return [...current, id]
    })
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-stone-500 py-12">
        <span className="w-4 h-4 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
        Cargando lotes…
      </div>
    )
  }

  if (batches.length === 0) {
    return (
      <EmptyState
        icon={GitCompare}
        title="No hay lotes para comparar"
        body="Registra lotes y solicita su análisis para compararlos lado a lado."
        action={<Link to="/batches" className="btn-primary">Ir a lotes</Link>}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="page-kicker">Comparación</p>
        <h1 className="page-title mt-2">Comparar lotes</h1>
        <p className="text-sm text-stone-500 mt-1">
          Selecciona hasta {MAX_SELECTION} lotes para comparar puntaje, categoría y mercado recomendado.
        </p>
      </div>

      <div className="card space-y-3">
        <p className="text-[11px] uppercase tracking-widest text-stone-400">Lotes disponibles</p>
        <div className="flex flex-wrap gap-2">
          {batches.map((batch) => {
            const active = selectedIds.includes(batch.id)
            return (
              <button
                key={batch.id}
                onClick={() => toggle(batch.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors ${
                  active
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line bg-panel text-stone-600 hover:border-stone-300'
                }`}
              >
                {active && <Check size={12} />}
                {batch.code}
              </button>
            )
          })}
        </div>
      </div>

      {selectedIds.length === 0 ? (
        <div className="card text-center py-12 text-stone-400 text-sm">
          Selecciona al menos un lote para comparar.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-stone-400 border-b border-line">
                <th className="py-2 pr-4 font-medium">Lote</th>
                <th className="py-2 pr-4 font-medium">Finca</th>
                <th className="py-2 pr-4 font-medium">Puntaje</th>
                <th className="py-2 pr-4 font-medium">Categoría</th>
                <th className="py-2 pr-4 font-medium">Confianza</th>
                <th className="py-2 pr-4 font-medium">Mercado top</th>
                <th className="py-2 font-medium">Modelo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {selectedDetails.map((detail) => {
                const prediction = detail.prediction || {}
                const topMarket = detail.marketFits?.[0]
                return (
                  <tr key={detail.id} className="align-top">
                    <td className="py-3 pr-4">
                      <Link to={`/batches/${detail.id}`} className="font-medium text-ink hover:underline">
                        {detail.code}
                      </Link>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {formatDate(detail.harvestDate)} · {labelVariety(detail.variety)}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-stone-600">{detail.farm?.name || detail.farmName || '—'}</td>
                    <td className="py-3 pr-4">
                      {prediction.status === 'DONE'
                        ? <span className="font-display text-xl text-ink">{prediction.predictedScore}</span>
                        : <span className="text-stone-400">Pendiente</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge category={prediction.qualityCategory || 'PENDING'} />
                    </td>
                    <td className="py-3 pr-4 text-stone-600">
                      {prediction.confidenceLevel != null
                        ? `${Math.round(prediction.confidenceLevel * 100)}%`
                        : '—'}
                    </td>
                    <td className="py-3 pr-4">
                      {topMarket ? (
                        <div>
                          <p className="text-ink">{labelMarket(topMarket.market)}</p>
                          <p className="text-[11px] text-stone-400">{topMarket.fitScore}/100</p>
                        </div>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 text-[11px] text-stone-500">
                      {prediction.modelVersion || '—'}
                      {prediction.usedFallback && <span className="block text-amber-700">respaldo</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {loadingDetails && selectedDetails.length < selectedIds.length && (
            <p className="text-xs text-stone-400 pt-3">Cargando detalle de los lotes…</p>
          )}
        </div>
      )}
    </div>
  )
}
