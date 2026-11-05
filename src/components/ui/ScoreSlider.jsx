/**
 * SCA score input — numeric input + visual bar (6.00–10.00).
 * Used in the cupping evaluation form.
 */
export default function ScoreSlider({ label, hint, name, register, value }) {
  const pct = value ? ((Number(value) - 6) / 4) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-espresso/80 font-medium">
          {label}
        </span>
        <span className="font-display text-lg leading-none text-ink tabular-nums w-10 text-right">
          {value || '—'}
        </span>
      </div>

      {/* Visual bar */}
      <div className="h-1 bg-line rounded-full overflow-hidden">
        <div
          className="h-1 bg-espresso rounded-full transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>

      <input
        type="number"
        step="0.25"
        min="6"
        max="10"
        placeholder="—"
        className="input-field text-sm"
        {...register(name, {
          min: { value: 6, message: 'Mínimo 6.00' },
          max: { value: 10, message: 'Máximo 10.00' },
        })}
      />

      {hint && <p className="text-[10px] text-stone-400">{hint}</p>}
    </div>
  )
}
