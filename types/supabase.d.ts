// ~/types/supabase.d.ts
declare module 'h3' {
  interface H3EventContext {
    user?: {
      id: string
      email?: string
      role?: string
      app_metadata?: Record<string, any>
      user_metadata?: Record<string, any>
    }
  }
}