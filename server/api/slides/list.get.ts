import { defineEventHandler, createError } from 'h3'
import { useStorage } from '#imports'
import { existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const storage = useStorage('presentations')
    const keys = await storage.getKeys()
    
    const presentations = await Promise.all(
      keys.map(async (key) => {
        try {
          const presentation = await storage.getItem(key)
          
          console.log('Processing presentation:', {
            key,
            presentation: presentation ? {
              id: presentation.id,
              title: presentation.title,
              createdAt: presentation.createdAt
            } : null
          })

          // Validate presentation
          if (!presentation || !presentation.id) {
            console.warn(`Invalid presentation for key: ${key}`)
            return null
          }

          // Check if presentation files exist
          const presentationPath = join(process.cwd(), 'public', 'presentations', presentation.id)
          const indexPath = join(presentationPath, 'index.html')
          
          if (!existsSync(presentationPath) || !existsSync(indexPath)) {
            console.warn(`Presentation files missing for id: ${presentation.id}`)
            // Remove invalid presentation from storage
            await storage.removeItem(key)
            return null
          }

          return presentation
        } catch (error) {
          console.error(`Error processing presentation key ${key}:`, error)
          return null
        }
      })
    )
    
    // Filter out null values and sort
    const validPresentations = presentations
      .filter(p => p !== null)
      .sort((a: any, b: any) => {
        // Handle potential date parsing issues
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })

    console.log(`Returning ${validPresentations.length} valid presentations`)
    return validPresentations
  } catch (error: any) {
    console.error('Error in presentations list:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
