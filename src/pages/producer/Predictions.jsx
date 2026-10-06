import { useState } from 'react'
import { mockBatches } from '../../data/mockData'
import Badge from '../../components/ui/Badge'
import { BarChart2, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'

const recommendations = {
  SPECIALTY: [
    { icon: TrendingUp, text: 'Tu café califica para canales de comercio directo y tostadores especializados.', type: 'success' },
    { icon: CheckCircle, text: 'Considera participar en subastas como Cup of Excellence para maximizar precio.', type: 'success' },
    { icon: CheckCircle, text: 'Documenta tu proceso detalladamente para respaldar la trazabilidad ante compradores.', type: 'info' },
  ],
  PREMIUM: [
    { icon: TrendingUp, text: 'Exporta con certificaciones Fair Trade o Rainforest Alliance para obtener mejor precio.', type: 'success' },
    { icon: AlertCircle, text: 'Ajusta el método de secado para mejorar el puntaje hacia la categoría Especialidad.', type: 'warning' },
  ],
  COMMERCIAL: [
    { icon: AlertCircle, text: 'Revisa el proceso de poscosecha: método de secado y niveles de humedad en almacenamiento.', type: 'warning' },
    { icon: AlertCircle, text: 'Verifica el pH del suelo, el rango óptimo es entre 5.5 y 6.5.', type: 'warning' },
  ],
}

export default function Predictions() {
  const [selectedBatch, setSelectedBatch] = useState(mockBatches[0])
  const doneBatches = mockBatches.filter((b) => b.prediction.status === 'DONE')

  const recs = recommendations[selectedBatch?.prediction?.qualityCategory] || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Predicciones de Calidad</h1>
        <p className="text-gray-500 mt-1">Resultados del análisis IA por lote</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Lotes analizados</h2>
          {mockBatches.map((batch) => (
            <button
              key={batch.id}
              onClick={() => setSelectedBatch(batch)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedBatch?.id === batch.id
                  ? 'border-coffee-500 bg-coffee-50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900">{batch.code}</span>
                {batch.prediction.status === 'DONE' ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <Clock size={14} className="text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-400">{batch.farmName}</p>
              <div className="mt-2">
                <Badge category={batch.prediction.qualityCategory || 'PENDING'} />
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedBatch?.prediction?.status === 'DONE' ? (
            <>
              {/* Score card */}
              <div className="card bg-gradient-to-br from-coffee-600 to-coffee-800 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-coffee-200 text-sm">Puntaje de calidad</p>
                    <p className="text-5xl font-bold mt-1">{selectedBatch.prediction.predictedScore}</p>
                    <p className="text-coffee-200 text-sm mt-1">/ 100 puntos SCA</p>
                  </div>
                  <div className="text-right">
                    <BarChart2 size={40} className="text-coffee-300 mb-2" />
                    <Badge category={selectedBatch.prediction.qualityCategory} />
                    <p className="text-coffee-200 text-xs mt-2">
                      Confianza: {Math.round(selectedBatch.prediction.confidenceLevel * 100)}%
                    </p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-coffee-200 mb-1">
                    <span>Nivel de confianza del modelo</span>
                    <span>{Math.round(selectedBatch.prediction.confidenceLevel * 100)}%</span>
                  </div>
                  <div className="h-2 bg-coffee-900/50 rounded-full">
                    <div
                      className="h-2 bg-white rounded-full transition-all"
                      style={{ width: `${selectedBatch.prediction.confidenceLevel * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Batch info */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">Información del lote</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-400">Código</dt>
                    <dd className="font-medium text-gray-900">{selectedBatch.code}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Finca</dt>
                    <dd className="font-medium text-gray-900">{selectedBatch.farmName}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Variedad</dt>
                    <dd className="font-medium text-gray-900">{selectedBatch.variety || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Proceso</dt>
                    <dd className="font-medium text-gray-900">{selectedBatch.processingMethod || '—'}</dd>
                  </div>
                </dl>
              </div>

              {/* Recommendations */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">Recomendaciones</h3>
                <div className="space-y-3">
                  {recs.map((rec, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 p-3 rounded-lg text-sm ${
                        rec.type === 'success' ? 'bg-emerald-50 text-emerald-800' :
                        rec.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-blue-50 text-blue-800'
                      }`}
                    >
                      <rec.icon size={16} className="shrink-0 mt-0.5" />
                      <p>{rec.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card text-center py-16">
              <Clock size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-600">Predicción pendiente</p>
              <p className="text-sm text-gray-400 mt-1">
                Registra las variables de producción para solicitar el análisis.
              </p>
              <button className="btn-primary mt-4">Solicitar predicción</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
