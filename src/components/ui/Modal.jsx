import { X } from 'lucide-react'

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-panel border border-line w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display text-xl text-ink">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-ink" type="button">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
