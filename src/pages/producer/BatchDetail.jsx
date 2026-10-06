import { useParams, Link, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import {
  Package, ArrowLeft, Calendar, Weight, Leaf,
  BarChart2, CheckCircle, Clock, AlertCircle, TrendingUp,
} from 'lucide-react'

const recommendations = {
  SPECIALTY: [
    { icon: TrendingUp, text: 'Tu café califica para canales de comercio directo y tostadores especializados.', type: 'success' },
    { icon: CheckCircle, text: 'Considera participar en subastas como Cup of Excellence para maximizar el precio.', type: 'success' },
    { icon: CheckCircle, text: 'Documenta tu proceso detalladamente para respaldar la trazabilidad ante compradores internacionales.', type: 'info' },
  ],
  PREMIUM: [
    { icon: TrendingUp, text: 'Exporta con certificaciones Fair Trade o Rainforest Alliance para obtener mejor precio.', type: 'success' },
    { icon: AlertCircle, text: 'Ajusta el método de secado para mejorar el puntaje hacia la categoría Especialidad.', type: 'warning' },
  ],
  COMMERCIAL: [
    { icon: AlertCircle, text: 'Revisa el proceso de poscosecha: método de secado y niveles de humedad en almacenamiento.', type: 'warning' },
    { icon: AlertCircle, text: 'Verifica el pH del suelo; el rango óptimo para café es entre 5.5 y 6.5.', type: 'warning' },
  ],
  LOW_GRADE: [
    { icon: AlertCircle, text: 'Evalúa con urgencia el proceso de poscosecha y las condiciones de almacenamiento.', type: 'error' },
    { icon: AlertCircle, text: 'Considera asesoría técnica para mejorar prácticas agronómicas en la próxima temporada.', type: 'error' },
  ],
}

const recStyles = {
  success: 'bg-emerald-50 text-emerald-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error:   'bg-red-50 text-red-800',
  info:    'bg-blue-50 text-blue-800',
}

export default function BatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBatchById, getFarmById } = useData()

  const batch = getBatchById(id)
  const farm = batch ? getFarmById(batch.farmId) : null

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package size={48} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Lote no encontrado</h2>
        <p className="text-gray-400 mb-6">El lote que buscas no existe o fue eliminado.</p>
        <Link to="/batches" className="btn-primary">Volver a mis lotes</Link>
      </div>
    )
  }

  const prediction = batch.prediction
  const recs = recommendations[prediction?.qualityCategory] || []

  return (
    <div className="space-y-6">
      {/* Back */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-coffee-50 rounded-xl">
            <Package size={24} className="text-coffee-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{batch.code}</h1>
            <div className="flex items-center gap-2 mt-1">
              {farm && (
                <Link to={`/farms/${farm.id}`} className="flex items-center gap-1 text-sm text-coffee-600 hover:underline">
                  <Leaf size={13} /> {farm.name}
                </Link>
              )}
              <Badge category={prediction?.qualityCategory || 'PENDING'} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: batch info */}
        <div className="space-y-4 lg:col-span-1">
          {/* General info */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Información del lote</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-400 flex items-center gap-1.5"><Calendar size={13} /> Cosecha</dt>
                <dd className="font-medium text-gray-900">{batch.harvestDate || '—'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-400 flex items-center gap-1.5"><Weight size={13} /> Peso</dt>
                <dd className="font-medium text-gray-900">{batch.weight ? `${batch.weight} kg` : '—'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Variedad</dt>
                <dd className="font-medium text-gray-900">{batch.variety || '—'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Proceso</dt>
                <dd className="font-medium text-gray-900">{batch.processingMethod || '—'}</dd>
              </div>
              {farm && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-400">Finca</dt>
                  <dd className="font-medium text-gray-900">{farm.name}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Right: prediction */}
        <div className="lg:col-span-2 space-y-4">
          {prediction?.status === 'DONE' ? (
            <>
              {/* Score hero */}
              <div className="card bg-gradient-to-br from-coffee-600 to-coffee-900 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-coffee-200 text-sm">Puntaje de calidad estimado</p>
                    <p className="text-6xl font-black mt-1 tracking-tight">
                      {prediction.predictedScore}
                    </p>
                    <p className="text-coffee-300 text-sm">/ 100 puntos SCA</p>
                  </div>
                  <div className="text-right">
                    <BarChart2 size={44} className="text-coffee-400 mb-3" />
                    <Badge category={prediction.qualityCategory} />
                  </div>
                </div>

                {/* Confidence */}
                <div>
                  <div className="flex justify-between text-xs text-coffee-300 mb-1.5">
                    <span>Confianza del modelo</span>
                    <span>{Math.round(prediction.confidenceLevel * 100)}%</span>
                  </div>
                  <div className="h-2 bg-coffee-900/60 rounded-full">
                    <div
                      className="h-2 bg-white/80 rounded-full"
                      style={{ width: `${prediction.confidenceLevel * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {recs.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3">Recomendaciones del sistema</h3>
                  <div className="space-y-2.5">
                    {recs.map((rec, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-lg text-sm ${recStyles[rec.type]}`}>
                        <rec.icon size={16} className="shrink-0 mt-0.5" />
                        <p>{rec.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-16">
              <Clock size={44} className="mx-auto text-gray-200 mb-3" />
              <p className="font-semibold text-gray-700">Predicción pendiente</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
                Aún no se ha realizado el análisis de IA para este lote.
                Registra las variables de producción para solicitarlo.
              </p>
              <Link to="/predictions" className="btn-primary mt-5 inline-block">
                Ir a predicciones
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
