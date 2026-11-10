const DOT = {
  SPECIALTY: 'bg-sage-300',
  PREMIUM:   'bg-crema',
  COMMERCIAL:'bg-amber-400',
  LOW_GRADE: 'bg-coral-400',
  PENDING:   'bg-muted',
}

const variants = {
  SPECIALTY: 'badge-specialty',
  PREMIUM:   'badge-premium',
  COMMERCIAL:'badge-commercial',
  LOW_GRADE: 'badge-low',
  PENDING:   'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-line text-muted',
}

const labels = {
  SPECIALTY: 'Especialidad',
  PREMIUM:   'Premium',
  COMMERCIAL:'Comercial',
  LOW_GRADE: 'Bajo grado',
  PENDING:   'Pendiente',
}

export default function Badge({ category }) {
  const cls   = variants[category] || variants.PENDING
  const label = labels[category]   || category
  const dot   = DOT[category]      || DOT.PENDING
  return (
    <span className={cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
