import { defineEventHandler, createError } from 'h3'
import { execa } from 'execa'
import { join } from 'path'
import { useStorage } from '#imports'
import { v4 as uuidv4 } from 'uuid'
import { exportJobs } from '../../export-status/[jobId].get'

async function startPptxExportProcess(jobId: string, id: string) {
  try {
    const storage = useStorage('presentations')
    const presentation = await storage.getItem(`${id}.json`)
    if (!presentation) {
      throw new Error('Presentation not found')
    }

    const presentationDir = join(process.cwd(), 'storage', 'presentations', id)
    const slidesPath = join(presentationDir, 'slides.md')
    const outputPath = join(presentationDir, 'presentation.pptx')

    console.log('Exporting presentation to PPTX...')
    console.log('Slides path:', slidesPath)
    console.log('Output path:', outputPath)

    const result = await execa('npx', [
      'slidev',
      'export',
      slidesPath,
      '--output',
      outputPath,
      '--format',
      'pptx'
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

    exportJobs[jobId].status = 'Completed'
    exportJobs[jobId].outputPath = outputPath
    exportJobs[jobId].filename = `${presentation.title}.pptx`
  } catch (error: any) {
    console.error('PPTX export error:', error)
    exportJobs[jobId] = { 
      status: 'Failed', 
      error: error.message,
      presentationId: id
    }
  }
}

export default defineEventHandler(async (event) => {
  const jobId = uuidv4();
  const id = event.context.params.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Presentation ID is required'
    });
  }

  try {
    exportJobs[jobId] = { 
      status: 'Processing',
      presentationId: id
    };

    startPptxExportProcess(jobId, id).catch(error => {
      console.error('Unhandled PPTX export error:', error);
      exportJobs[jobId] = { 
        status: 'Failed', 
        error: error.message,
        presentationId: id
      };
    });
    
    return { jobId, status: 'Processing' };
  } catch (error: any) {
    console.error('PPTX export error:', error)
    exportJobs[jobId] = { 
      status: 'Failed', 
      error: error.message,
      presentationId: id
    };
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to export presentation'
    });
  }
});
