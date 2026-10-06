import { useState } from 'react'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import { useToast } from '../../components/ui/Toast'
import {
  BarChart2, TrendingUp, AlertCircle, CheckCircle,
  Clock, Coffee, Zap, Package,
} from 'lucide-react'

const recommendations = {
  SPECIALTY: [
    { icon: TrendingUp, text: 'Tu café califica para canales de comercio directo y tostadores especializados.', type: 'success' },
    { icon: CheckCircle, text: 'Considera participar en subastas como Cup of Excellence para maximizar el precio de venta.', type: 'success' },
    { icon: CheckCircle, text: 'Documenta tu proceso para respaldar la trazabilidad ante compradores internacionales.', type: 'info' },
  ],
  PREMIUM: [
    { icon: TrendingUp, text: 'Exporta con certificaciones Fair Trade o Rainforest Alliance para aumentar el precio.', type: 'success' },
    { icon: AlertCircle, text: 'Ajusta el método de secado para acercarte a la categoría Especialidad (score ≥ 85).', type: 'warning' },
  ],
  COMMERCIAL: [
    { icon: AlertCircle, text: 'Revisa la poscosecha: método de secado y humedad en almacenamiento.', type: 'warning' },
    { icon: AlertCircle, text: 'Verifica el pH del suelo (óptimo: 5.5–6.5) y considera asesoría agronómica.', type: 'warning' },
  ],
  LOW_GRADE: [
    { icon: AlertCircle, text: 'Evalúa con urgencia las condiciones de almacenamiento y el proceso de beneficio.', type: 'error' },
    { icon: AlertCircle, text: 'Busca asesoría técnica especializada para la próxima temporada.', type: 'error' },
  ],
}

const recStyles = {
  success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
  warning: 'bg-yellow-50 border-yellow-100 text-yellow-800',
  error:   'bg-red-50 border-red-100 text-red-800',
  info:    'bg-blue-50 border-blue-100 text-blue-800',
}

const scoreColor = (score) => {
  if (!score) return 'text-gray-400'
  if (score >= 85) return 'text-emerald-600'
  if (score >= 75) return 'text-blue-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-500'
}

export default function Predictions() {
  const { batches } = useData()
  const { showToast, ToastComponent } = useToast()
  const [selectedId, setSelectedId] = useState(batches[0]?.id || null)

  const selected = batches.find((b) => b.id === selectedId)
  const recs = recommendations[selected?.prediction?.qualityCategory] || []

  const handleRequestPrediction = () => {
    showToast('Análisis solicitado. El modelo procesará tu lote pronto.', 'info')
  }

  if (batches.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Predicciones de Calidad</h1>
        <div className="card text-center py-16">
          <Coffee size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="font-semibold text-gray-600">Sin lotes registrados</p>
          <p className="text-sm text-gray-400 mt-1">Registra una finca y un lote para solicitar predicciones.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {ToastComponent}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Predicciones de Calidad</h1>
        <p className="text-gray-500 mt-1 text-sm">Análisis de calidad por lote mediante inteligencia artificial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Batch selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Seleccionar lote</p>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {batches.map((batch) => {
              const done = batch.prediction?.status === 'DONE'
              return (
                <button
                  key={batch.id}
                  onClick={() => setSelectedId(batch.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedId === batch.id
                      ? 'border-coffee-500 bg-coffee-50 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-gray-900">{batch.code}</span>
                    {done
                      ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      : <Clock size={14} className="text-gray-300 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{batch.farmName}</p>
                  <div className="flex items-center justify-between">
                    <Badge category={batch.prediction?.qualityCategory || 'PENDING'} />
                    {done && (
                      <span className={`text-sm font-black ${scoreColor(batch.prediction.predictedScore)}`}>
                        {batch.prediction.predictedScore} pts
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {!selected ? (
            <div className="card text-center py-16">
              <Package size={36} className="mx-auto text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">Selecciona un lote</p>
            </div>
          ) : selected.prediction?.status === 'DONE' ? (
            <>
              {/* Score hero */}
              <div className="rounded-2xl bg-gradient-to-br from-coffee-700 to-coffee-950 text-white p-6 shadow-lg">
                <p className="text-coffee-300 text-sm mb-1">Puntaje de calidad estimado</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-7xl font-black tracking-tight leading-none">
                      {selected.prediction.predictedScore}
                    </span>
                    <span className="text-coffee-300 text-lg ml-1">/ 100</span>
                    <p className="text-coffee-300 text-xs mt-1">Escala SCA</p>
                  </div>
                  <div className="text-right">
                    <BarChart2 size={44} className="text-coffee-500 mb-2 ml-auto" />
                    <Badge category={selected.prediction.qualityCategory} />
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-coffee-700">
                  <div className="flex justify-between text-xs text-coffee-300 mb-1.5">
                    <span>Confianza del modelo IA</span>
                    <span className="font-semibold text-white">
                      {Math.round(selected.prediction.confidenceLevel * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-coffee-900/60 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-coffee-300 to-white rounded-full transition-all"
                      style={{ width: `${selected.prediction.confidenceLevel * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Batch summary */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Información del lote</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ['Código', selected.code],
                    ['Finca', selected.farmName],
                    ['Variedad', selected.variety || '—'],
                    ['Proceso', selected.processingMethod || '—'],
                    ['Cosecha', selected.harvestDate || '—'],
                    ['Peso', selected.weight ? `${selected.weight} kg` : '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                      <dt className="text-gray-400">{k}</dt>
                      <dd className="font-medium text-gray-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Recommendations */}
              {recs.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <Zap size={15} className="text-coffee-500" /> Recomendaciones del sistema
                  </h3>
                  <div className="space-y-2.5">
                    {recs.map((rec, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-lg text-sm border ${recStyles[rec.type]}`}>
                        <rec.icon size={15} className="shrink-0 mt-0.5" />
                        <p>{rec.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-gray-300" />
              </div>
              <p className="font-semibold text-gray-700">Predicción pendiente</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
                Registra las variables de producción de este lote para solicitar el análisis de IA.
              </p>
              <button onClick={handleRequestPrediction} className="btn-primary mt-5 flex items-center gap-2 mx-auto">
                <Zap size={15} /> Solicitar predicción
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
