import { useEffect, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const CONFIG = {
  success: {
    icon: CheckCircle2,
    cls: 'border-sage-300 bg-sage-50 text-sage-800',
    icon_cls: 'text-sage-600',
  },
  error: {
    icon: XCircle,
    cls: 'border-coral-200 bg-coral-50 text-coral-800',
    icon_cls: 'text-coral-600',
  },
  warning: {
    icon: AlertTriangle,
    cls: 'border-amber-200 bg-amber-50 text-amber-800',
    icon_cls: 'text-amber-600',
  },
  info: {
    icon: Info,
    cls: 'border-line bg-canvas text-ink',
    icon_cls: 'text-crema',
  },
}

export function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(false)
  const { icon: Icon, cls, icon_cls } = CONFIG[type] || CONFIG.info

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300) }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  return (
    <div className={`
      fixed bottom-6 right-6 z-50
      flex items-start gap-3 px-4 py-3
      rounded-lg border shadow-warm-lg
      max-w-xs text-sm
      transition-all duration-300
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      ${cls}
    `}>
      <Icon size={16} className={`${icon_cls} shrink-0 mt-0.5`} />
      <p className="flex-1 leading-snug">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="shrink-0 opacity-50 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const ToastComponent = (
    <>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => hideToast(t.id)} />
      ))}
    </>
  )

  return { showToast, ToastComponent }
}
