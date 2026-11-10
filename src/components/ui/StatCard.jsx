const ACCENT = {
  default: { bar: 'bg-crema',       text: 'text-crema'   },
  sage:    { bar: 'bg-sage-500',    text: 'text-sage-600' },
  amber:   { bar: 'bg-amber-400',   text: 'text-amber-700'},
  coral:   { bar: 'bg-coral-400',   text: 'text-coral-700'},
  muted:   { bar: 'bg-muted',       text: 'text-muted'   },
}

export default function StatCard({ title, value, subtitle, accent = 'default', icon: Icon }) {
  const a = ACCENT[accent] || ACCENT.default
  return (
    <div className="card relative overflow-hidden">
      {/* accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${a.bar}`} />

      <div className="flex items-start justify-between gap-2">
        <p className="page-kicker">{title}</p>
        {Icon && <Icon size={15} className={`${a.text} mt-0.5 shrink-0`} />}
      </div>

      <p className={`font-display text-4xl mt-3 leading-none ${a.text}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted mt-2">{subtitle}</p>}
    </div>
  )
}
