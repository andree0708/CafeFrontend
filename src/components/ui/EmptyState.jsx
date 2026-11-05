export default function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="card text-center py-16 px-6">
      {Icon && (
        <div className="w-12 h-12 border border-line mx-auto mb-4 flex items-center justify-center">
          <Icon size={20} className="text-espresso" />
        </div>
      )}
      <p className="font-display text-xl text-ink mb-1">{title}</p>
      {body && <p className="text-stone-500 text-sm max-w-sm mx-auto">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
