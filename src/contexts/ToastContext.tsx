import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ToastBox, ToastActionBtn, type ToastType } from '@/components/ui/Toast'

export interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, action?: ToastAction) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

interface ToastState {
  id: number
  message: string
  type: ToastType
  action?: ToastAction
  leaving: boolean
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'success', action?: ToastAction) => {
    const id = Date.now()
    setToast({ id, message, type, action, leaving: false })

    const duration = type === 'error' ? 4800 : 2800
    setTimeout(() => setToast(t => t?.id === id ? { ...t, leaving: true } : t), duration)
    setTimeout(() => setToast(t => t?.id === id ? null : t), duration + 300)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && createPortal(
        <ToastBox $leaving={toast.leaving} $type={toast.type} $hasAction={!!toast.action}>
          <span>{toast.type === 'error' ? '⚠ ' : '✓ '}{toast.message}</span>
          {toast.action && (
            <ToastActionBtn onClick={() => { toast.action!.onClick(); setToast(null) }}>
              {toast.action.label}
            </ToastActionBtn>
          )}
        </ToastBox>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être dans <ToastProvider>')
  return ctx
}
