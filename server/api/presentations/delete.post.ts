import { defineEventHandler, readBody, createError } from 'h3'
import { supabase } from '~/server/utils/supabase'
import { rm } from 'fs/promises'
import { join } from 'path'

interface DeleteRequest {
  id: string
}

export default defineEventHandler(async (event) => {
  try {
    // Read the body and assert it as a DeleteRequest
    let body = (await readBody(event)) as DeleteRequest

    // If the body is a string, parse it into an object of type DeleteRequest
    if (typeof body === 'string') {
      body = JSON.parse(body) as DeleteRequest
    }
    
    console.log('Delete request body:', body)
    
    // Validate the request body using the DeleteRequest interface
    if (!body?.id || typeof body.id !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Invalid presentation ID'
      })
    }
    
    const { id } = body
    console.log('Deleting presentation ID:', id)

    // Delete related slides from Supabase
    const { error: slideError } = await supabase
      .from('slides')
      .delete()
      .eq('id', id)

    // Delete related user_slides from Supabase
    const { error: userSlideError } = await supabase
      .from('user_slides')
      .delete()
      .eq('slide_id', id)

    if (slideError || userSlideError) {
      throw slideError || userSlideError
    }

    // Delete local files in the presentation directory
    const presentationDir = join(process.cwd(), 'storage', 'presentations', id)
    await rm(presentationDir, { recursive: true, force: true })

    return { success: true }
  } catch (error: any) {
    console.error('Delete error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete presentation'
    })
  }
})
