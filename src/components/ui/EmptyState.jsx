export default function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="card text-center py-20 px-6 animate-fade-up">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-line mx-auto mb-5 flex items-center justify-center">
          <Icon size={22} className="text-crema" />
        </div>
      )}
      <p className="font-display text-2xl text-ink">{title}</p>
      {body && <p className="text-muted text-sm max-w-sm mx-auto mt-2 leading-relaxed">{body}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  )
}
