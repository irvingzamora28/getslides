import { writeFile, mkdir, readdir, cp } from 'fs/promises'
import { join, basename } from 'path'
import { execa } from 'execa'
import { existsSync } from 'fs'

export async function generateSlidevPresentation(id: string, content: string) {
  console.log('Starting Slidev presentation generation...');

  let publicPublicDir = ""

  // Ensure presentations directory exists
  const presentationDir = join(process.cwd(), 'storage', 'presentations', id);
  console.log('Presentation directory:', presentationDir);

  const distDir = join(presentationDir, 'dist');
  const publicDistDir = join(process.cwd(), 'public', 'presentations', id);

  console.log("Current directory:", process.cwd());
  // If the current directory is .output, create a public directory outside it, meaning ../public
  
  if (basename(process.cwd()) === '.output') {
    publicPublicDir = join(process.cwd(), '..', 'public', 'presentations', id);
  }

  await mkdir(presentationDir, { recursive: true });
  console.log('Created presentation directory if it did not exist.');

  await mkdir(distDir, { recursive: true });
  console.log('Created distribution directory if it did not exist.');

  await mkdir(publicDistDir, { recursive: true });
  console.log('Created public distribution directory if it did not exist.');

  // if publicPublicDir is not empty
  if (publicPublicDir) {
    await mkdir(publicPublicDir, { recursive: true });
    console.log('Created public public directory if it did not exist.');
  }

  // Create slides.md file
  const slidesPath = join(presentationDir, 'slides.md');
  await writeFile(slidesPath, content);
  console.log('Written slides.md file at:', slidesPath);

  try {
    // Generate Slidev presentation with base path
    try {
      const buildResult = await execa('npx', [
        'slidev', 
        'build', 
        slidesPath, 
        '--out', distDir, 
        '--base', `/presentations/${id}/`
      ], {
        cwd: process.cwd(),
        stdio: 'pipe', // Prevent output from causing server restart
        env: {
          ...process.env,
          NODE_ENV: 'production' // Ensure production mode
        }
      });
      console.log('Slidev build result:', buildResult);
    } catch (error) {
      console.error('Slidev script: Error generating Slidev presentation:', error);
      throw error; // Rethrow to handle it upstream if needed
    }

    // Copy generated files to public directory
    console.log('Attempting to copy files from distDir:', distDir);
    console.log('Attempting to copy files to publicDistDir:', publicDistDir);
    await cp(distDir, publicDistDir, { recursive: true });
    // Copy generated files to public directory
    if (publicPublicDir) {
      console.log('Attempting to copy files from distDir:', distDir);
      console.log('Attempting to copy files to publicPublicDir:', publicPublicDir);
      await cp(distDir, publicPublicDir, { recursive: true });
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
