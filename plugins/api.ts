// ~/plugins/api.ts
export default defineNuxtPlugin(() => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Only intercept requests to our API (handle both /api and /api/)
    if (typeof input === 'string' && (input === '/api' || input.startsWith('/api/'))) {
      let token: string | null = null
      
      // Only access localStorage in client-side context
      if (process.client) {
        token = localStorage.getItem('sb-access-token')
      }
      
      init = init || {}
      
      // Add authorization header if token exists
      if (token) {
        init.headers = {
          ...init.headers,
          'Authorization': `Bearer ${token}`
        }
      }
    }
    
    return originalFetch(input, init)
  }
})
