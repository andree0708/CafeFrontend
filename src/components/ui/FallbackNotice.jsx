import { AlertTriangle } from 'lucide-react'

/**
 * Warns that the shown score comes from the deterministic rule-based fallback
 * because the ML service was unavailable.
 */
export default function FallbackNotice({ prediction }) {
  if (!prediction?.usedFallback) return null

  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-amber-900">
      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-medium">Predicción de respaldo</p>
        <p className="text-[11px] leading-relaxed mt-0.5">
          El servicio de IA no estaba disponible, así que se usó el modelo de reglas determinista.
          Vuelve a analizar cuando el servicio esté en línea para obtener la explicación SHAP.
          {prediction.fallbackReason ? ` Motivo: ${prediction.fallbackReason}` : ''}
        </p>
      </div>
    </div>
  )
}
