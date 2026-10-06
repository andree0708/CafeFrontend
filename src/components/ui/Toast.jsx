import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import clsx from 'clsx'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
}

const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

export function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true)
  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={clsx(
        'fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm transition-all duration-300',
        styles[type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      )}
    >
      <Icon size={18} className="shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="ml-1 hover:opacity-70">
        <X size={15} />
      </button>
    </div>
  )
}

// Simple hook to manage toasts
import { useCallback } from 'react'
export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  const ToastComponent = toast
    ? <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast} />
    : null

  return { showToast, ToastComponent }
}
