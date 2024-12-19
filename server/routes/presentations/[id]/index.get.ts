import { serveSlidevPresentation } from '~/server/utils/slidev'
import { defineEventHandler } from 'h3'
import { useStorage } from '#imports'
import { createError } from 'h3'
import { join, basename } from 'path'
import { stat, readdir } from 'fs/promises'
import { createReadStream } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Presentation ID is required' })
    }

    // Construct full path to the file
    const requestPath = getRequestPath(event)
    console.log("___________ INDEX ___________");
    
    console.log('Requested Path:', requestPath)

    // Check if presentation exists
    const storage = useStorage('presentations')
    const presentation = await storage.getItem(`${id}.json`)
    
    if (!presentation) {
      throw createError({ statusCode: 404, message: 'Presentation not found' })
    }

    // Serve Slidev presentation
    const presentationDir = await serveSlidevPresentation(id)

    // Debug logging
    console.log('Presentation Directory:', presentationDir)
    
    try {
      // List directory contents for debugging
      const files = await readdir(presentationDir)
      console.log('Directory Contents:', files)
    } catch (dirError) {
      console.error('Failed to read directory:', dirError)
    }

    // Extract the requested file from the path
    const requestedFile = requestPath.replace(`/presentations/${id}/`, '')
    console.log('Requested File:', requestedFile);
    
    let fullFilePath = join(process.cwd(), 'public', 'presentations', id, requestedFile)
    console.log('Full File Path:', fullFilePath)

    // Check if the requested path is a directory
    const statResult = await stat(fullFilePath);
    if (statResult.isDirectory()) {
      // Serve index.html if the requested path is a directory
      fullFilePath = join(fullFilePath, 'index.html');
    }

    // Check if file exists
    const fileExists = await stat(fullFilePath);
    if (!fileExists) {
      throw createError({ statusCode: 404, message: 'File not found' });
    }

    // Set headers and stream the file
    const fileStream = createReadStream(fullFilePath)
    
    // Determine content type based on file extension
    const ext = basename(fullFilePath).split('.').pop()?.toLowerCase()
    const contentTypes: Record<string, string> = {
      'html': 'text/html',
      'js': 'application/javascript',
      'css': 'text/css',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'svg': 'image/svg+xml',
      'json': 'application/json'
    }
    const contentType = contentTypes[ext || ''] || 'application/octet-stream'
    console.log('Content-Type:', contentType)
    event.node.res.setHeader('Content-Type', contentType)
    fileStream.pipe(event.node.res)
    console.log('File Stream:', fileStream);
    
    return new Promise((resolve, reject) => {
      fileStream.on('end', resolve)
      fileStream.on('error', reject)
    })
  } catch (error: any) {
    console.error('Presentation Serving Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message
    })
  }
})

// Helper function to get the request path
function getRequestPath(event: any): string {
  // @ts-ignore
  return event.node.req.url || ''
}
