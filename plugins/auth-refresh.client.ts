// ~/plugins/auth-refresh.client.ts
export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  
  supabase.auth.onAuthStateChange(async (event, session) => {
    switch (event) {
      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
        if (session?.access_token) {
          localStorage.setItem('sb-access-token', session.access_token)
        }
        break
      case 'SIGNED_OUT':
        localStorage.removeItem('sb-access-token')
        break
    }
  })

  // Set initial token if session exists
  const initSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      localStorage.setItem('sb-access-token', session.access_token)
    }
  }

  initSession()
})