const variants = {
  SPECIALTY: 'badge-specialty',
  PREMIUM: 'badge-premium',
  COMMERCIAL: 'badge-commercial',
  LOW_GRADE: 'badge-low',
  PENDING: 'inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium tracking-wide bg-line text-ink',
}

const labels = {
  SPECIALTY: 'Especialidad',
  PREMIUM: 'Premium',
  COMMERCIAL: 'Comercial',
  LOW_GRADE: 'Bajo grado',
  PENDING: 'Pendiente',
}

export default function Badge({ category }) {
  const cls = variants[category] || variants.PENDING
  const label = labels[category] || category
  return <span className={cls}>{label}</span>
}
