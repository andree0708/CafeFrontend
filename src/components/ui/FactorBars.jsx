import { formatFeatureValue, labelFeature } from '../../lib/labels'

/**
 * Renders the SHAP contribution of each feature as a horizontal bar.
 * Positive contributions increase the predicted score, negative ones lower it.
 */
export default function FactorBars({ factors = [], baseline, method, title = 'Factores que explican el puntaje' }) {
  if (!factors || factors.length === 0) return null

  const max = Math.max(...factors.map((factor) => Math.abs(factor.contribution || 0)), 0.001)

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="page-kicker">Explicabilidad</p>
          <h3 className="font-display text-xl mt-1">{title}</h3>
          <p className="text-xs text-stone-500 mt-1">
            Contribución de cada variable sobre el resultado. Verde suma, rojo resta.
          </p>
        </div>
        {method && (
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-stone-400 text-right">
            {method}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {factors.map((factor) => {
          const contribution = Number(factor.contribution) || 0
          const positive = factor.direction === 'positive' || contribution >= 0
          const width = Math.max(4, (Math.abs(contribution) / max) * 100)
          return (
            <div key={factor.feature}>
              <div className="flex items-center justify-between text-xs mb-1 gap-3">
                <span className="font-medium text-ink truncate">{labelFeature(factor.feature)}</span>
                <span className="text-stone-500 shrink-0">
                  {formatFeatureValue(factor.feature, factor.value)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-line/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${positive ? 'bg-emerald-600' : 'bg-red-500'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className={`w-14 text-right text-[11px] font-medium ${positive ? 'text-emerald-700' : 'text-red-600'}`}>
                  {contribution > 0 ? '+' : ''}{contribution}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {baseline !== null && baseline !== undefined && (
        <p className="text-[11px] text-stone-400 pt-2 border-t border-line">
          Puntaje base del modelo: {baseline} / 100
        </p>
      )}
    </div>
  )
}
