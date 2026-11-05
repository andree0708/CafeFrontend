import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { BarChart2, Zap, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { DRYING, IRRIGATION, PEST_CONTROL, labelVariety, labelProcess, dateInputValue } from '../../lib/labels'

const PRIORITY = { high: 'Alta', medium: 'Media', low: 'Baja' }
const REC_CAT  = { commercialization: 'Mercado', processing: 'Poscosecha', agronomic: 'Agronomía' }

export default function Predictions() {
  const { batches, fetchBatch, saveVariables, requestPrediction, loading } = useData()
  const { showToast, ToastComponent } = useToast()

  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail]         = useState(null)
  const [loadingDetail, setLD]      = useState(false)
  const [saving, setSaving]         = useState(false)
  const [predicting, setPred]       = useState(false)

  const varsForm = useForm()

  // Select first batch on load
  useEffect(() => {
    if (batches.length > 0 && !selectedId) setSelectedId(batches[0].id)
  }, [batches])

  // Load full detail when selection changes
  useEffect(() => {
    if (!selectedId) return
    const loadDetail = async () => {
      setLD(true)
      try {
        const data = await fetchBatch(selectedId)
        setDetail(data)
        varsForm.reset(data.productionVariables || {})
      } catch {
        setDetail(null)
      } finally {
        setLD(false)
      }
    }
    loadDetail()
  }, [selectedId])

  const onSaveVars = async (data) => {
    if (!detail) return
    setSaving(true)
    try {
      await saveVariables(detail.id, data)
      const updated = await fetchBatch(detail.id)
      setDetail(updated)
      showToast('Variables guardadas.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const onPredict = async () => {
    if (!detail) return
    setPred(true)
    try {
      await requestPrediction(detail.id)
      const updated = await fetchBatch(detail.id)
      setDetail(updated)
      showToast('Análisis completado.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setPred(false)
    }
  }

  if (loading) return (
    <div className="flex items-center gap-2 text-stone-500 py-12">
      <span className="w-4 h-4 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
      Cargando…
    </div>
  )

  const prediction = detail?.aiPrediction || detail?.prediction
  const recs        = detail?.recommendations || []

  return (
    <div className="space-y-8">
      {ToastComponent}

      <div>
        <p className="page-kicker">Modelo de calidad</p>
        <h1 className="page-title mt-2">Análisis IA</h1>
        <p className="text-sm text-stone-500 mt-1">
          Selecciona un lote, completa sus variables y obtén la predicción del modelo.
        </p>
      </div>

      {batches.length === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="No hay lotes para analizar"
          body="Registra una finca, agrega un lote y luego pide la predicción."
          action={<Link to="/farms" className="btn-primary">Ir a fincas</Link>}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Batch list ─────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-3">Tus lotes</p>
            {batches.map((b) => {
              const pred = b.prediction
              const done = pred?.status === 'DONE'
              const isSelected = selectedId === b.id
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`w-full text-left p-4 rounded-md border transition-all ${
                    isSelected
                      ? 'border-ink bg-white shadow-sm'
                      : 'border-line bg-panel hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{b.code}</p>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">
                        {b.farmName}
                        {b.variety ? ` · ${labelVariety(b.variety)}` : ''}
                      </p>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {done
                        ? <CheckCircle2 size={14} className="text-emerald-600" />
                        : <Clock size={14} className="text-stone-300" />}
                    </div>
                  </div>
                  {done && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-display text-base text-ink">{pred.predictedScore}</span>
                      <Badge category={pred.qualityCategory} />
                    </div>
                  )}
                  {!done && (
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 mt-2">Pendiente</p>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Detail panel ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {loadingDetail ? (
              <div className="card flex items-center gap-2 text-stone-500">
                <span className="w-4 h-4 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
                Cargando lote…
              </div>
            ) : detail ? (
              <>
                {/* Result or trigger */}
                <div className="card bg-ink text-paper space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="page-kicker text-paper/40">
                        {detail.farm?.name || detail.farmName}
                      </p>
                      <h2 className="font-display text-2xl mt-1">{detail.code}</h2>
                      <p className="text-paper/50 text-xs mt-1">
                        {labelVariety(detail.variety)} · {labelProcess(detail.processingMethod)}
                      </p>
                    </div>
                    <Link
                      to={`/batches/${detail.id}`}
                      className="shrink-0 flex items-center gap-1 text-paper/40 hover:text-paper text-xs transition-colors"
                    >
                      Ver todo <ChevronRight size={13} />
                    </Link>
                  </div>

                  {prediction?.status === 'DONE' ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-paper/50 text-xs mb-1">Puntaje SCA estimado</p>
                        <p className="font-display text-6xl leading-none">{prediction.predictedScore}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge category={prediction.qualityCategory} />
                          <span className="text-paper/40 text-xs">
                            {Math.round((prediction.confidenceLevel || 0) * 100)}% confianza · {prediction.modelVersion}
                          </span>
                        </div>
                      </div>
                      {/* Confidence bar */}
                      <div className="h-px bg-paper/10 rounded-full overflow-hidden">
                        <div
                          className="h-px bg-paper/50 rounded-full"
                          style={{ width: `${(prediction.confidenceLevel || 0) * 100}%` }}
                        />
                      </div>
                      <button
                        onClick={onPredict}
                        disabled={predicting}
                        className="w-full bg-paper/10 hover:bg-paper/20 text-paper text-sm py-2.5 rounded-md border border-paper/10 transition-colors disabled:opacity-50"
                      >
                        {predicting
                          ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-paper/20 border-t-paper/60 rounded-full animate-spin" />Analizando…</span>
                          : <span className="flex items-center justify-center gap-1.5"><Zap size={13} />Volver a analizar</span>}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-paper/60 text-sm leading-relaxed">
                        Completa las variables de producción y solicita el análisis. El modelo de IA usará clima, suelo, altitud y poscosecha para estimar la calidad.
                      </p>
                      {prediction?.status === 'ERROR' && (
                        <p className="text-red-400 text-xs">Error en el último análisis. Intenta de nuevo.</p>
                      )}
                      <button
                        onClick={onPredict}
                        disabled={predicting}
                        className="w-full bg-paper text-ink text-sm py-2.5 rounded-md font-medium hover:bg-paper/90 transition-colors disabled:opacity-50"
                      >
                        {predicting
                          ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />Analizando…</span>
                          : <span className="flex items-center justify-center gap-1.5"><Zap size={13} />Solicitar predicción</span>}
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick variables form */}
                <form onSubmit={varsForm.handleSubmit(onSaveVars)} className="card space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl">Variables rápidas</h3>
                    <span className="text-xs text-stone-400">Afectan directamente la predicción</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <VarField label="Temperatura media (°C)">
                      <input type="number" step="0.1" min="-10" max="50" className="input-field" {...varsForm.register('avgTemperature')} />
                    </VarField>
                    <VarField label="pH del suelo">
                      <input type="number" step="0.1" min="0" max="14" className="input-field" {...varsForm.register('soilPH')} />
                    </VarField>
                    <VarField label="Humedad almacenamiento (%)">
                      <input type="number" step="0.1" min="0" max="100" className="input-field" {...varsForm.register('storageMoisture')} />
                    </VarField>
                    <VarField label="Método de secado">
                      <select className="input-field" {...varsForm.register('dryingMethod')}>
                        <option value="">—</option>
                        {DRYING.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </VarField>
                    <VarField label="Control de plagas">
                      <select className="input-field" {...varsForm.register('pestControlType')}>
                        <option value="">—</option>
                        {PEST_CONTROL.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </VarField>
                    <VarField label="Lluvia anual (mm)">
                      <input type="number" min="0" max="10000" className="input-field" {...varsForm.register('avgRainfall')} />
                    </VarField>
                  </div>

                  <div className="flex gap-3">
                    <button className="btn-primary" disabled={saving}>
                      {saving
                        ? <><span className="w-3 h-3 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />Guardando…</>
                        : 'Guardar variables'}
                    </button>
                    <Link to={`/batches/${detail.id}`} className="btn-secondary">
                      Todas las variables
                    </Link>
                  </div>
                </form>

                {/* Recommendations */}
                {recs.length > 0 && (
                  <div className="card space-y-4">
                    <h3 className="font-display text-xl">Recomendaciones</h3>
                    {recs.map((r, i) => (
                      <div key={r.id || i} className={`pt-4 ${i > 0 ? 'border-t border-line' : ''}`}>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400">
                          {REC_CAT[r.category] || r.category}
                          <span className={`ml-2 ${r.priority === 'high' ? 'text-espresso' : 'text-stone-300'}`}>
                            · {PRIORITY[r.priority] || r.priority}
                          </span>
                        </p>
                        <p className="font-medium text-sm mt-1">{r.title}</p>
                        <p className="text-sm text-stone-500 mt-1 leading-relaxed">{r.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center py-12 text-stone-400">
                Selecciona un lote para ver el detalle
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function VarField({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-espresso/80 font-medium">{label}</span>
      {children}
    </label>
  )
}
