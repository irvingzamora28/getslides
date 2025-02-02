import { defineEventHandler, createError } from 'h3'
import { supabase } from '~/server/utils/supabase'

interface Slide {
  id: string
  title: string
  created_at: string
  content: string
}

interface UserSlide {
  slide_id: string
  slides: Slide[]
}

// ~/server/api/slides/list.get.ts
export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user
    
    if (!user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User context missing'
      })
    }

    const { data, error } = await supabase
      .from('user_slides')
      .select(`
        slide_id,
        slides (id, title, created_at, content)
      `)
      .eq('user_id', user.id)
        
    if (error) throw error
    if (!data) return []

    // Transform the data into presentations
    const presentations = data
      .map(userSlide => {
        // Access the slides property directly
        const slide = userSlide.slides;
        if (!slide?.id) {
          console.log('No valid slide data found');
          return null;
        }

        const presentation = {
          id: slide.id,
          title: slide.title || 'Untitled Presentation',
          content: slide.content || '',
          createdAt: slide.created_at || new Date().toISOString(),
          status: 'completed'
        };

        return presentation;
      })
      .filter(Boolean) // Remove any null entries
      
    return presentations
  } catch (error: any) {
    console.error('API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message
    })
  }
})