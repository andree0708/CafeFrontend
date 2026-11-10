import { labelMarket, labelOpportunity, opportunityLevelForScore } from '../../lib/labels'

const TONES = {
  high: 'bg-emerald-600',
  medium: 'bg-amber-500',
  low: 'bg-stone-400',
}

const TEXT_TONES = {
  high: 'text-emerald-700',
  medium: 'text-amber-700',
  low: 'text-stone-500',
}

/**
 * Shows the commercial fit of a lot for every destination market.
 * The backend already sorts them from the best opportunity to the worst.
 */
export default function MarketBars({ marketFits = [], title = 'Oportunidad por mercado' }) {
  if (!marketFits || marketFits.length === 0) return null

  return (
    <div className="card space-y-4">
      <div>
        <p className="page-kicker">Recomendación comercial</p>
        <h3 className="font-display text-xl mt-1">{title}</h3>
        <p className="text-xs text-stone-500 mt-1">
          Compatibilidad estimada del lote con cada destino de venta.
        </p>
      </div>

      <div className="space-y-4">
        {marketFits.map((fit) => {
          const score = Number(fit.fitScore) || 0
          const level = fit.opportunityLevel || opportunityLevelForScore(score)
          return (
            <div key={fit.market}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{labelMarket(fit.market)}</p>
                  {fit.description && (
                    <p className="text-[11px] text-stone-400 truncate">{fit.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-lg text-ink leading-none">{score.toFixed(1)}</p>
                  <p className={`text-[10px] uppercase tracking-wider ${TEXT_TONES[level] || TEXT_TONES.low}`}>
                    {labelOpportunity(level)}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-line/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${TONES[level] || TONES.low}`}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>
              {fit.rationale && (
                <details className="mt-1.5">
                  <summary className="text-[11px] text-stone-400 cursor-pointer hover:text-ink">
                    Ver razones
                  </summary>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{fit.rationale}</p>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
