import { defineEventHandler, createError } from 'h3'
import { execa } from 'execa'
import { join } from 'path'
import { useStorage } from '#imports'
import { createReadStream } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id
    if (!id) {
      throw new Error('Presentation ID is required')
    }

    console.log('Starting PDF export for presentation:', id)

    // Get presentation from storage
    const storage = useStorage('presentations')
    const presentation = await storage.getItem(`${id}.json`)
    if (!presentation) {
      throw new Error('Presentation not found')
    }

    // Get the slides.md path
    const presentationDir = join(process.cwd(), 'storage', 'presentations', id)
    const slidesPath = join(presentationDir, 'slides.md')
    const outputPath = join(presentationDir, 'presentation.pdf')

    console.log('Exporting presentation to PDF...')
    console.log('Slides path:', slidesPath)
    console.log('Output path:', outputPath)

    // Export to PDF using slidev
    try {
      const result = await execa('npx', [
        'slidev',
        'export',
        slidesPath,
        '--output',
        outputPath
      ], {
        cwd: process.cwd(),
        stdio: 'pipe',
        env: {
          ...process.env,
          NODE_ENV: 'production'
        }
      })
      
      console.log('Slidev export output:', result.stdout)
      if (result.stderr) {
        console.error('Slidev export stderr:', result.stderr)
      }
    } catch (exportError) {
      console.error('Slidev export error:', exportError)
      throw new Error(`Failed to export PDF: ${exportError.message}`)
    }

    // Set response headers for PDF download
    event.node.res.setHeader('Content-Type', 'application/pdf')
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${presentation.title}.pdf"`)

    // Stream the PDF file
    return createReadStream(outputPath)
  } catch (error: any) {
    console.error('PDF export error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to export presentation'
    })
  }
})
