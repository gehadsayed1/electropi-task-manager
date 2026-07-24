import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function add(message: string, type: ToastType = 'info', duration = 3500): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: string): void {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  function success(message: string): void {
    add(message, 'success')
  }

  function error(message: string): void {
    add(message, 'error')
  }

  function warning(message: string): void {
    add(message, 'warning')
  }

  function info(message: string): void {
    add(message, 'info')
  }

  return { toasts, add, remove, success, error, warning, info }
}
