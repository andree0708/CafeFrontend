export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <p className="page-kicker">{title}</p>
      <p className="font-display text-3xl text-ink mt-3 leading-none">{value}</p>
      {subtitle && <p className="text-xs text-stone-500 mt-2">{subtitle}</p>}
    </div>
  )
}
