import { useCallback, useEffect, useState } from 'react'
import { useData } from '../../context/DataContext'
import { CheckCircle2, Cpu, RefreshCw, XCircle } from 'lucide-react'
import { labelFeature } from '../../lib/labels'

const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('es-CO')
}

export default function ModelInfo() {
  const { fetchAiStatus } = useData()
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAiStatus()
      setStatus(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fetchAiStatus])

  useEffect(() => { load() }, [load])

  const model = status?.model
  const metrics = model?.metrics
  const crossValidation = metrics?.crossValidation
  const importances = (model?.featureImportances || []).slice(0, 12)
  const maxImportance = Math.max(...importances.map((item) => item.importance), 0.001)

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="page-kicker">Motor de inferencia</p>
          <h1 className="page-title mt-2">Modelo de IA</h1>
          <p className="text-sm text-stone-500 mt-1">
            Versión, métricas y variables más influyentes del modelo de calidad.
          </p>
        </div>
        <button onClick={load} disabled={loading} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Service status */}
      <div className="card flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${status?.online ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
            <Cpu size={17} />
          </div>
          <div>
            <p className="font-medium text-ink">
              Servicio de inferencia {status?.online ? 'en línea' : 'sin conexión'}
            </p>
            <p className="text-xs text-stone-500">
              {status?.online
                ? 'FastAPI respondiendo en el puerto configurado.'
                : 'El backend no pudo contactar el servicio de IA.'}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${status?.online ? 'text-emerald-700' : 'text-red-600'}`}>
          {status?.online ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
          {status?.online ? 'Disponible' : 'No disponible'}
        </span>
      </div>

      {!status?.online && (
        <div className="card space-y-2">
          <h2 className="font-display text-xl">Cómo levantar el servicio</h2>
          <p className="text-sm text-stone-500">
            Desde la carpeta <code className="text-ink">CafeAI</code>:
          </p>
          <pre className="bg-ink text-paper text-xs rounded-md p-3 overflow-x-auto">
{`.venv\\Scripts\\python -m uvicorn main:app --host 127.0.0.1 --port 8001`}
          </pre>
          <p className="text-xs text-stone-400">
            Si el modelo no existe, ejecuta primero <code>python train.py</code>.
          </p>
        </div>
      )}

      {model && (
        <>
          {/* Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric label="Versión" value={model.version || '—'} />
            <Metric label="MAE" value={metrics?.mae != null ? `${metrics.mae} pts` : '—'} />
            <Metric label="R² prueba" value={metrics?.r2 != null ? metrics.r2 : '—'} />
            <Metric label="R² validación cruzada" value={crossValidation?.r2 != null ? crossValidation.r2 : '—'} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Metric label="Muestras de entrenamiento" value={metrics?.nSamples ?? metrics?.n_samples ?? '—'} />
            <Metric label="Variables del modelo" value={model.featureNames?.length ?? '—'} />
            <Metric label="Explicabilidad" value={model.explainability || '—'} />
          </div>

          <div className="card space-y-2">
            <p className="text-xs text-stone-500">
              <span className="font-medium text-ink">Entrenado:</span> {formatDateTime(model.trainedAt)}
            </p>
            <p className="text-xs text-stone-500">
              <span className="font-medium text-ink">Dataset:</span> {model.dataset || '—'}
            </p>
          </div>

          {/* Feature importance */}
          <div className="card space-y-4">
            <div>
              <p className="page-kicker">Importancia</p>
              <h2 className="font-display text-2xl mt-1">Variables más influyentes</h2>
              <p className="text-xs text-stone-500 mt-1">
                Importancia global del Random Forest (no explica un lote individual; para eso está SHAP).
              </p>
            </div>
            <div className="space-y-3">
              {importances.map((item) => (
                <div key={item.feature}>
                  <div className="flex items-center justify-between text-xs mb-1 gap-3">
                    <span className="font-medium text-ink truncate">{labelFeature(item.feature)}</span>
                    <span className="text-stone-500 shrink-0">{(item.importance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-line/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-espresso rounded-full"
                      style={{ width: `${Math.max(3, (item.importance / maxImportance) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="card space-y-3">
            <h2 className="font-display text-2xl">Cómo funciona</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-stone-600">
              <li>Las variables agronómicas y de poscosecha se codifican en 43 características numéricas.</li>
              <li>El Random Forest estima el puntaje SCA esperado del lote.</li>
              <li>SHAP TreeExplainer calcula cuánto suma o resta cada variable a ese puntaje.</li>
              <li>El motor comercial cruza puntaje, altitud, proceso y volumen para recomendar mercados.</li>
            </ol>
            <p className="text-xs text-stone-400 pt-2 border-t border-line">
              Si el servicio de IA no responde, el backend usa un modelo de reglas determinista y lo marca
              explícitamente en la predicción.
            </p>
          </div>
        </>
      )}

      {loading && !status && (
        <div className="flex items-center gap-2 text-stone-500 py-6">
          <span className="w-4 h-4 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
          Consultando el servicio de IA…
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="card">
      <p className="text-[10px] uppercase tracking-widest text-stone-400">{label}</p>
      <p className="font-display text-2xl text-ink mt-1 break-words">{value}</p>
    </div>
  )
}
