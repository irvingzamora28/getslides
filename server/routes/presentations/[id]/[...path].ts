import { defineEventHandler, getRouterParams, createError, sendStream } from 'h3'
import { join } from 'path'
import { createReadStream, existsSync, statSync } from 'fs'

export default defineEventHandler(async (event) => {
  const { id, path } = getRouterParams(event)
  let filePath = join(process.cwd(), 'public', 'presentations', id)
  
  // If path is provided, append it to the base path
  if (path && path.length > 0) {
    filePath = join(filePath, ...path.split('/'))
  }
  console.log("___________ PATH ___________"); 
  console.log('Requested Path:', filePath)
  
  // Check if path exists
  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }
  
  // If it's a directory, serve index.html
  const stats = statSync(filePath)
  if (stats.isDirectory()) {
    filePath = join(filePath, 'index.html')
    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Index file not found'
      })
    }
  }

  // Set appropriate content type based on file extension
  const ext = filePath.split('.').pop()?.toLowerCase()
  const contentTypes: { [key: string]: string } = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'svg': 'image/svg+xml',
    'json': 'application/json'
  }
  
  console.log('Serving file:', filePath)
  console.log('Extension:', ext)
  console.log('Content-Type:', contentTypes[ext || ''])
  
  event.node.res.setHeader('Content-Type', contentTypes[ext || ''] || 'application/octet-stream')
  
  return sendStream(event, createReadStream(filePath))
})
