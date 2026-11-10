import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ title, subtitle, children, onClose, size = 'md' }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-[2px] animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-panel border border-line rounded-xl shadow-warm-xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto animate-fade-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-line">
          <div>
            <h2 className="font-display text-xl text-ink">{title}</h2>
            {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-line transition-colors -mt-0.5 -mr-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
