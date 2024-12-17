import { defineEventHandler, createError } from 'h3'
import { execa } from 'execa'
import { join } from 'path'
import { useStorage } from '#imports'
import { v4 as uuidv4 } from 'uuid'
import { exportJobs } from '../../export-status/[jobId].get'
import archiver from 'archiver'
import { createWriteStream } from 'fs'

async function startPngExportProcess(jobId: string, id: string) {
  try {
    const storage = useStorage('presentations')
    const presentation = await storage.getItem(`${id}.json`)
    if (!presentation) {
      throw new Error('Presentation not found')
    }

    const presentationDir = join(process.cwd(), 'storage', 'presentations', id)
    const slidesPath = join(presentationDir, 'slides.md')
    const outputDir = presentationDir;
    const outputZipPath = join(outputDir, 'presentation.zip');

    console.log('Exporting presentation to PNG...')
    console.log('Slides path:', slidesPath)
    console.log('Output directory:', outputDir)

    // Export to PNG using slidev
    const result = await execa('npx', [
      'slidev',
      'export',
      slidesPath,
      '--output',
      outputDir,
      '--format',
      'png'
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

    // Create a zip file containing the PNGs
    const output = createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Created ZIP file: ${outputZipPath} (${archive.pointer()} total bytes)`);
    });

    archive.pipe(output);

    // Append PNG files to the archive
    archive.directory(outputDir + '/', false);
    await archive.finalize();

    exportJobs[jobId].status = 'Completed';
    exportJobs[jobId].outputPath = outputZipPath;
    exportJobs[jobId].filename = `${presentation.title}.zip`;
  } catch (error: any) {
    console.error('PNG export error:', error)
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

    startPngExportProcess(jobId, id).catch(error => {
      console.error('Unhandled PNG export error:', error);
      exportJobs[jobId] = { 
        status: 'Failed', 
        error: error.message,
        presentationId: id
      };
    });
    
    return { jobId, status: 'Processing' };
  } catch (error: any) {
    console.error('PNG export error:', error)
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
