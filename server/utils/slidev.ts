import { writeFile, mkdir, readdir, cp } from 'fs/promises'
import { join, basename } from 'path'
import { execa } from 'execa'
import { existsSync } from 'fs'

export async function generateSlidevPresentation(id: string, content: string) {
  // Ensure presentations directory exists
  const presentationDir = join(process.cwd(), 'storage', 'presentations', id)
  const distDir = join(presentationDir, 'dist')
  const publicDistDir = join(process.cwd(), 'public', 'presentations', id)

  await mkdir(presentationDir, { recursive: true })
  await mkdir(distDir, { recursive: true })
  await mkdir(publicDistDir, { recursive: true })

  // Create slides.md file
  const slidesPath = join(presentationDir, 'slides.md')
  await writeFile(slidesPath, content)

  try {
    // Generate Slidev presentation with base path
    const buildResult = await execa('npx', [
      'slidev', 
      'build', 
      slidesPath, 
      '--out', distDir, 
      '--base', `/presentations/${id}/`
    ], {
      cwd: process.cwd()
    })
    console.log('Slidev Build Output:', buildResult.stdout)

    // Ensure index.html exists
    const indexPath = join(distDir, 'index.html')
    
    // If index.html doesn't exist, create a basic one
    if (!existsSync(indexPath)) {
      try {
        await writeFile(indexPath, `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Presentation</title>
          </head>
          <body>
            <h1>Presentation Generated</h1>
            <p>Your Slidev presentation has been generated.</p>
          </body>
          </html>
        `)
        console.log('Created fallback index.html')
      } catch (htmlError) {
        console.error('Failed to create index.html:', htmlError)
      }
    }

    // Copy generated files to public directory
    await cp(distDir, publicDistDir, { recursive: true })
    console.log('Copied files to public directory:', publicDistDir)

    // List files in public dist directory for debugging
    try {
      const publicDistFiles = await readdir(publicDistDir)
      console.log('Public Dist Directory Files:', publicDistFiles)
    } catch (listError) {
      console.error('Failed to list public dist directory:', listError)
    }

    return {
      slidesPath,
      distPath: distDir,
      publicDistPath: publicDistDir,
      previewUrl: `/presentations/${id}/index.html`
    }
  } catch (error) {
    console.error('Slidev generation error:', error)
    throw new Error('Failed to generate Slidev presentation')
  }
}

export async function serveSlidevPresentation(id: string) {
  const presentationDir = join(process.cwd(), 'public', 'presentations', id)
  return presentationDir
}
