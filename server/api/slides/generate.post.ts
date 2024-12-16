import { generateSlideContent } from '~/server/utils/openai'
import { generateSlidevPresentation } from '~/server/utils/slidev'
import { defineEventHandler, readBody } from 'h3'
import { v4 as uuidv4 } from 'uuid'
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const { prompt } = await readBody(event)
    
    if (!prompt) {
      throw new Error('Prompt is required')
    }

    // Generate slide content
    const content = await generateSlideContent(prompt)
    console.log('Generated slide content:', content);
    
    // Create presentation metadata
    const presentation = {
      id: uuidv4(),
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      content,
      createdAt: new Date().toISOString(),
      prompt
    }

    // Generate Slidev presentation
    const slidevResult = await generateSlidevPresentation(presentation.id, content)
    
    // Update presentation with Slidev details
    presentation.slidevPath = slidevResult.slidesPath
    presentation.previewUrl = slidevResult.previewUrl

    // Save to storage after successful generation
    const storage = useStorage('presentations')
    await storage.setItem(`${presentation.id}.json`, presentation)

    return presentation
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
