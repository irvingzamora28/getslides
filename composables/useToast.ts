// ~/composables/useToast.ts
import { ref } from 'vue'

export interface ToastMessage {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export function useToast() {
  const toastMessage = ref<ToastMessage | null>(null)
  
  const show = (options: ToastMessage) => {
    toastMessage.value = {
      ...options,
      duration: options.duration || 3000
    }
    
    // Auto-clear the toast after specified duration
    setTimeout(() => {
      toastMessage.value = null
    }, options.duration || 3000)
  }
  
  const success = (message: string, duration?: number) => {
    show({ message, type: 'success', duration })
  }
  
  const error = (message: string, duration?: number) => {
    show({ message, type: 'error', duration })
  }
  
  const warning = (message: string, duration?: number) => {
    show({ message, type: 'warning', duration })
  }
  
  const info = (message: string, duration?: number) => {
    show({ message, type: 'info', duration })
  }
  
  return {
    toastMessage,
    show,
    success,
    error,
    warning,
    info
  }
}