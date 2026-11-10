import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useData } from '../../context/DataContext'
import { useToast } from '../../components/ui/Toast'
import Badge from '../../components/ui/Badge'
import ScoreSlider from '../../components/ui/ScoreSlider'
import { ArrowLeft, FlaskConical, Zap, ChevronDown, ChevronUp, Trash2, History } from 'lucide-react'
import {
  DRYING, IRRIGATION, PEST_CONTROL, SOIL_TYPES,
  formatDate, labelDrying, labelIrrigation, labelPest, labelSoil,
  labelProcess, labelVariety, dateInputValue,
} from '../../lib/labels'
import FactorBars from '../../components/ui/FactorBars'
import MarketBars from '../../components/ui/MarketBars'
import FallbackNotice from '../../components/ui/FallbackNotice'

const PRIORITY  = { high: 'Alta', medium: 'Media', low: 'Baja' }
const REC_CAT   = { commercialization: 'Mercado', processing: 'Poscosecha', agronomic: 'Agronomía' }

const SCA_ATTRIBUTES = [
  { name: 'fragranceScore',  label: 'Fragancia / Aroma',  hint: 'Olor del café molido y en taza' },
  { name: 'flavorScore',     label: 'Sabor',               hint: 'Intensidad y calidad general del sabor' },
  { name: 'aftertasteScore', label: 'Retrogusto',          hint: 'Persistencia del sabor al tragar' },
  { name: 'acidityScore',    label: 'Acidez',              hint: 'Vivacidad y brillo de la acidez' },
  { name: 'bodyScore',       label: 'Cuerpo',              hint: 'Textura y peso en boca' },
  { name: 'balanceScore',    label: 'Balance',             hint: 'Armonía entre los atributos' },
  { name: 'uniformityScore', label: 'Uniformidad',         hint: 'Consistencia entre las 5 tazas' },
  { name: 'cleanCupScore',   label: 'Taza limpia',         hint: 'Ausencia de sabores extraños' },
  { name: 'sweetnessScore',  label: 'Dulzura',             hint: 'Percepción de dulzura natural' },
  { name: 'overallScore',    label: 'Impresión global',    hint: 'Calificación holística del evaluador' },
]

export default function BatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    fetchBatch, saveVariables, requestPrediction,
    fetchEvaluation, saveEvaluation, deleteEvaluation,
  } = useData()
  const { showToast, ToastComponent } = useToast()

  const [batch, setBatch]       = useState(null)
  const [evaluation, setEval]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [predicting, setPred]   = useState(false)
  const [savingEval, setSavingEval] = useState(false)
  const [showEval, setShowEval] = useState(false)

  // Forms
  const varsForm = useForm()
  const evalForm = useForm()

  // Watch all SCA score fields for live total
  const scores = evalForm.watch(SCA_ATTRIBUTES.map((a) => a.name))
  const filledScores = scores.filter((v) => v !== '' && v != null).map(Number)
  const totalScore = filledScores.length === 10
    ? filledScores.reduce((a, b) => a + b, 0).toFixed(2)
    : null

  const load = async () => {
    try {
      const data = await fetchBatch(id)
      setBatch(data)
      varsForm.reset(data.productionVariables || {})

      const ev = await fetchEvaluation(id)
      setEval(ev)
      if (ev) {
        evalForm.reset({
          ...ev,
          evaluationDate: dateInputValue(ev.evaluationDate),
        })
      }
    } catch {
      setBatch(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  if (loading) return (
    <div className="flex items-center gap-2 text-stone-500 py-12">
      <span className="w-4 h-4 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
      Cargando lote…
    </div>
  )

  if (!batch) {
    return (
      <div className="text-center py-24">
        <p className="page-kicker">Error</p>
        <h2 className="page-title mt-2">Lote no encontrado</h2>
        <Link to="/batches" className="btn-primary mt-6">Volver a mis lotes</Link>
      </div>
    )
  }

  const prediction = batch.aiPrediction || batch.prediction
  const recs        = batch.recommendations || []

  // ── Handlers ────────────────────────────────────────────────────────────────
  const onSaveVars = async (data) => {
    setSaving(true)
    try {
      await saveVariables(batch.id, data)
      await load()
      showToast('Variables guardadas.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const onPredict = async () => {
    setPred(true)
    try {
      await requestPrediction(batch.id)
      await load()
      showToast('Análisis completado.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setPred(false)
    }
  }

  const onSaveEval = async (data) => {
    setSavingEval(true)
    try {
      const saved = await saveEvaluation(batch.id, data)
      setEval(saved)
      showToast('Evaluación de cata guardada.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSavingEval(false)
    }
  }

  const onDeleteEval = async () => {
    if (!window.confirm('¿Eliminar la evaluación de cata de este lote?')) return
    try {
      await deleteEvaluation(batch.id)
      setEval(null)
      evalForm.reset({})
      showToast('Evaluación eliminada.', 'warning')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {ToastComponent}

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="page-kicker">{batch.farm?.name || batch.farmName}</p>
          <h1 className="page-title mt-2">{batch.code}</h1>
          <p className="text-sm text-stone-500 mt-2">
            {formatDate(batch.harvestDate)}
            {batch.variety ? ` · ${labelVariety(batch.variety)}` : ''}
            {batch.processingMethod ? ` · ${labelProcess(batch.processingMethod)}` : ''}
            {batch.weight ? ` · ${batch.weight} kg` : ''}
          </p>
        </div>
        <Badge category={prediction?.qualityCategory || 'PENDING'} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ── Left: variables form ─────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={varsForm.handleSubmit(onSaveVars)} className="card space-y-5">
            <div>
              <p className="page-kicker">Entrada del modelo</p>
              <h2 className="font-display text-2xl mt-1">Variables de producción</h2>
              <p className="text-xs text-stone-500 mt-1">
                Estos datos alimentan el modelo de IA. Completa los que tengas disponibles.
              </p>
            </div>

            {/* Climate */}
            <section className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400">Clima</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <VarField label="Temperatura media (°C)" hint="-10 a 50">
                  <input type="number" step="0.1" min="-10" max="50" className="input-field" {...varsForm.register('avgTemperature')} />
                </VarField>
                <VarField label="Lluvia anual (mm)" hint="0 a 10,000">
                  <input type="number" min="0" max="10000" className="input-field" {...varsForm.register('avgRainfall')} />
                </VarField>
                <VarField label="Humedad relativa (%)" hint="0 a 100">
                  <input type="number" step="0.1" min="0" max="100" className="input-field" {...varsForm.register('avgHumidity')} />
                </VarField>
              </div>
            </section>

            {/* Soil */}
            <section className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400">Suelo</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <VarField label="pH del suelo" hint="0 a 14 (óptimo 5.5–6.5)">
                  <input type="number" step="0.1" min="0" max="14" className="input-field" {...varsForm.register('soilPH')} />
                </VarField>
                <VarField label="Materia orgánica (%)" hint="0 a 100">
                  <input type="number" step="0.1" min="0" max="100" className="input-field" {...varsForm.register('soilOrganicMatter')} />
                </VarField>
                <VarField label="Nitrógeno" hint="0 a 100">
                  <input type="number" step="0.1" min="0" max="100" className="input-field" {...varsForm.register('soilNitrogen')} />
                </VarField>
                <VarField label="Tipo de suelo">
                  <select className="input-field" {...varsForm.register('soilType')}>
                    <option value="">—</option>
                    {SOIL_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </VarField>
              </div>
            </section>

            {/* Crop management */}
            <section className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400">Manejo del cultivo</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <VarField label="Fertilización">
                  <input className="input-field" placeholder="ej. 3 veces/año" maxLength={50} {...varsForm.register('fertilizationFrequency')} />
                </VarField>
                <VarField label="Control de plagas">
                  <select className="input-field" {...varsForm.register('pestControlType')}>
                    <option value="">—</option>
                    {PEST_CONTROL.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </VarField>
                <VarField label="Sistema de riego">
                  <select className="input-field" {...varsForm.register('irrigationType')}>
                    <option value="">—</option>
                    {IRRIGATION.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </VarField>
              </div>
            </section>

            {/* Post-harvest */}
            <section className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400">Poscosecha</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <VarField label="Método de secado">
                  <select className="input-field" {...varsForm.register('dryingMethod')}>
                    <option value="">—</option>
                    {DRYING.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </VarField>
                <VarField label="Días de secado" hint="1 a 365">
                  <input type="number" min="1" max="365" className="input-field" {...varsForm.register('dryingDays')} />
                </VarField>
                <VarField label="Humedad almacenamiento (%)" hint="≤ 12 recomendado">
                  <input type="number" step="0.1" min="0" max="100" className="input-field" {...varsForm.register('storageMoisture')} />
                </VarField>
                <VarField label="Horas de fermentación" hint="12 a 72 h recomendado">
                  <input type="number" step="1" min="0" max="240" className="input-field" {...varsForm.register('fermentationHours')} />
                </VarField>
              </div>
            </section>

            {/* Current values summary */}
            {batch.productionVariables && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-line text-xs text-stone-500">
                {batch.productionVariables.dryingMethod  && <span>Secado: {labelDrying(batch.productionVariables.dryingMethod)}</span>}
                {batch.productionVariables.irrigationType && <span>· Riego: {labelIrrigation(batch.productionVariables.irrigationType)}</span>}
                {batch.productionVariables.pestControlType && <span>· Plagas: {labelPest(batch.productionVariables.pestControlType)}</span>}
                {batch.productionVariables.soilPH && <span>· pH: {batch.productionVariables.soilPH}</span>}
                {batch.productionVariables.soilType && <span>· Suelo: {labelSoil(batch.productionVariables.soilType)}</span>}
                {batch.productionVariables.fermentationHours != null && <span>· Fermentación: {batch.productionVariables.fermentationHours} h</span>}
              </div>
            )}

            <button className="btn-primary" disabled={saving}>
              {saving
                ? <><span className="w-3 h-3 border-2 border-paper/30 border-t-paper rounded-full animate-spin" /> Guardando…</>
                : 'Guardar variables'}
            </button>
          </form>

          {/* ── Cupping Evaluation ─────────────────────────────────────────── */}
          <div className="card space-y-5">
            <button
              type="button"
              onClick={() => setShowEval(!showEval)}
              className="w-full flex items-center justify-between"
            >
              <div className="text-left">
                <p className="page-kicker flex items-center gap-1.5">
                  <FlaskConical size={12} /> Evaluación sensorial
                </p>
                <h2 className="font-display text-2xl mt-1">Cata SCA</h2>
                {evaluation?.totalScore && (
                  <p className="text-sm text-stone-500 mt-1">
                    Puntaje de cata: <span className="font-display text-lg text-ink">{evaluation.totalScore}</span> / 100
                  </p>
                )}
                {!evaluation && (
                  <p className="text-xs text-stone-400 mt-1">Sin evaluación registrada</p>
                )}
              </div>
              <div className="text-stone-400">
                {showEval ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showEval && (
              <form onSubmit={evalForm.handleSubmit(onSaveEval)} className="space-y-5 pt-2 border-t border-line">
                <p className="text-xs text-stone-500">
                  Ingresa los puntajes SCA (6.00–10.00) de cada atributo. El total se calcula automáticamente.
                </p>

                {/* SCA score grid */}
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  {SCA_ATTRIBUTES.map((attr) => (
                    <ScoreSlider
                      key={attr.name}
                      label={attr.label}
                      hint={attr.hint}
                      name={attr.name}
                      register={evalForm.register}
                      value={evalForm.watch(attr.name)}
                    />
                  ))}
                </div>

                {/* Live total */}
                <div className="flex items-center justify-between py-3 border-t border-b border-line">
                  <span className="text-sm font-medium text-stone-600">Puntaje total</span>
                  <div className="text-right">
                    {totalScore ? (
                      <>
                        <span className="font-display text-3xl text-ink">{totalScore}</span>
                        <span className="text-stone-400 text-sm ml-1">/ 100</span>
                      </>
                    ) : (
                      <span className="text-stone-300 text-sm">Completa los 10 atributos</span>
                    )}
                  </div>
                </div>

                {/* Extra fields */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <VarField label="Defectos encontrados" hint="0 a 100">
                    <input type="number" min="0" max="100" className="input-field" {...evalForm.register('defects')} />
                  </VarField>
                  <VarField label="Nombre del evaluador">
                    <input className="input-field" maxLength={100} placeholder="Nombre completo" {...evalForm.register('evaluatorName')} />
                  </VarField>
                  <VarField label="Fecha de cata">
                    <input type="date" className="input-field" {...evalForm.register('evaluationDate')} />
                  </VarField>
                </div>

                <VarField label="Notas de la cata">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    placeholder="Observaciones, descriptores sensoriales, etc."
                    className="input-field resize-none"
                    {...evalForm.register('notes')}
                  />
                </VarField>

                <div className="flex items-center justify-between gap-3">
                  <button type="submit" className="btn-primary" disabled={savingEval}>
                    {savingEval
                      ? <><span className="w-3 h-3 border-2 border-paper/30 border-t-paper rounded-full animate-spin" /> Guardando…</>
                      : 'Guardar evaluación'}
                  </button>
                  {evaluation && (
                    <button
                      type="button"
                      onClick={onDeleteEval}
                      className="btn-danger flex items-center gap-1.5 text-xs"
                    >
                      <Trash2 size={13} /> Eliminar cata
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Right: prediction + recommendations ──────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction card */}
          <div className="card bg-ink text-paper space-y-4">
            <p className="page-kicker text-paper/50">Modelo IA</p>

            {prediction?.status === 'DONE' ? (
              <>
                <div>
                  <p className="text-paper/60 text-xs mb-1">Puntaje SCA estimado</p>
                  <p className="font-display text-7xl leading-none">{prediction.predictedScore}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge category={prediction.qualityCategory} />
                    <span className="text-paper/50 text-xs">
                      {Math.round((prediction.confidenceLevel || 0) * 100)}% confianza
                    </span>
                  </div>
                  <p className="text-paper/30 text-[10px] mt-2">{prediction.modelVersion}</p>
                </div>

                {/* Confidence bar */}
                <div>
                  <div className="h-px bg-paper/10 rounded-full overflow-hidden">
                    <div
                      className="h-px bg-paper/60 rounded-full transition-all"
                      style={{ width: `${(prediction.confidenceLevel || 0) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={onPredict}
                  disabled={predicting}
                  className="w-full bg-paper/10 hover:bg-paper/20 text-paper text-sm py-2.5 rounded-md border border-paper/10 transition-colors disabled:opacity-50"
                >
                  {predicting
                    ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-paper/20 border-t-paper/70 rounded-full animate-spin" /> Analizando…</span>
                    : <span className="flex items-center justify-center gap-1.5"><Zap size={13} /> Volver a analizar</span>}
                </button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-display text-2xl">Sin predicción</h3>
                  <p className="text-paper/60 text-sm mt-2 leading-relaxed">
                    Guarda las variables de producción y solicita el análisis. El modelo usa altitud, clima, suelo y poscosecha.
                  </p>
                  {prediction?.status === 'ERROR' && (
                    <p className="text-red-300 text-xs mt-2">Error en el último análisis. Intenta de nuevo.</p>
                  )}
                </div>

                <button
                  onClick={onPredict}
                  disabled={predicting}
                  className="w-full bg-paper text-ink text-sm py-2.5 rounded-md font-medium hover:bg-paper/90 transition-colors disabled:opacity-50"
                >
                  {predicting
                    ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-ink/20 border-t-ink rounded-full animate-spin" /> Analizando…</span>
                    : <span className="flex items-center justify-center gap-1.5"><Zap size={13} /> Solicitar predicción</span>}
                </button>
              </>
            )}
          </div>

          <FallbackNotice prediction={prediction} />

          <FactorBars
            factors={prediction?.topFactors}
            baseline={prediction?.baselineScore ?? prediction?.rawOutput?.baselineScore}
            method={prediction?.explanationMethod}
          />

          <MarketBars marketFits={batch.marketFits} />

          {batch.predictionRuns?.length > 1 && (
            <div className="card space-y-3">
              <div className="flex items-center gap-2">
                <History size={15} className="text-stone-400" />
                <h3 className="font-display text-lg">Historial de análisis</h3>
              </div>
              <div className="divide-y divide-line">
                {batch.predictionRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between gap-3 py-2 text-xs">
                    <div className="min-w-0">
                      <p className="text-stone-500 truncate">
                        {new Date(run.createdAt).toLocaleString('es-CO')}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {run.modelVersion || '—'}
                        {run.usedFallback ? ' · respaldo' : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display text-base text-ink">{run.predictedScore}</span>
                      <Badge category={run.qualityCategory || 'PENDING'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cupping score comparison */}
          {evaluation?.totalScore && prediction?.predictedScore && (
            <div className="card space-y-3">
              <p className="page-kicker">Comparación</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white/60 rounded-md border border-line">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Cata SCA</p>
                  <p className="font-display text-2xl text-ink">{evaluation.totalScore}</p>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-md border border-line">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Predicción IA</p>
                  <p className="font-display text-2xl text-ink">{prediction.predictedScore}</p>
                </div>
              </div>
              <p className="text-xs text-stone-400">
                Diferencia: {Math.abs(evaluation.totalScore - prediction.predictedScore).toFixed(1)} puntos
              </p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  )
}

// ── Helper component ──────────────────────────────────────────────────────────
function VarField({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-espresso/80 font-medium">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[10px] text-stone-400">{hint}</span>}
    </label>
  )
}
