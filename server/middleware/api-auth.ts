// ~/server/middleware/api-auth.ts
import { defineEventHandler, getHeader } from 'h3'
import { supabase } from '../utils/supabase'

// Routes that require authentication
const protectedRoutes = [
  '/api/presentations',
  '/api/user',
  '/api/slides'
]

export default defineEventHandler(async (event) => {
  const path = event.path || event.req.url || ''
  
  // Check if the current route requires authentication
  const requiresAuth = protectedRoutes.some(route => path.startsWith(route))
  
  if (!requiresAuth) {
    return // Allow public routes to pass through
  }

  try {
    const authHeader = getHeader(event, 'Authorization')
    const token = authHeader?.split('Bearer ')[1]
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization token required'
      })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    // Set the user in the event context
    event.context.user = user
    
    if (error || !user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    // Attach complete user object with typing
    event.context.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata
    }

  } catch (error: any) {
    console.error('Authentication error:', error)
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Authentication failed',
      message: error.message
    })
  }
})