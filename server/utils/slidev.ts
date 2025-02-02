import { writeFile, mkdir, readdir, cp } from 'fs/promises'
import { join, basename } from 'path'
import { execa } from 'execa'
import { existsSync } from 'fs'
import { supabase } from '~/server/utils/supabase'

export async function generateSlidevPresentation(id: string, content: string, event: any) {
  console.log('Starting Slidev presentation generation...');
  console.log("Content:", content);
  
  // Save slides to Supabase database
  const { data: slideData, error } = await supabase
    .from('slides')
    .insert([{
      title: 'Untitled Presentation',
      content,
      theme: {}
    }])
    .select()

  if (error) throw error
  
  const slideId = slideData[0].id

  // Ensure the user is authenticated and available in the event context
  const user = event.context.user;
  console.log('User:', user);


  if (!user || !user.id) {
    throw new Error('User is not authenticated or user ID is null');
  }

  const userId = user.id;
  console.log('User ID:', userId);

  // Link slide to user
  const { error: userSlideError } = await supabase
    .from('user_slides')
    .insert({
      user_id: userId,
      slide_id: slideId
    })

  if (userSlideError) throw userSlideError

  // Ensure presentations directory exists
  const presentationDir = join(process.cwd(), 'storage', 'presentations', id);
  console.log('Presentation directory:', presentationDir);

  const distDir = join(presentationDir, 'dist');
  const publicDistDir = join(process.cwd(), 'public', 'presentations', id);

  console.log("Current directory:", process.cwd());

  await mkdir(presentationDir, { recursive: true });
  console.log('Created presentation directory if it did not exist.');

  await mkdir(distDir, { recursive: true });
  console.log('Created distribution directory if it did not exist.');

  await mkdir(publicDistDir, { recursive: true });
  console.log('Created public distribution directory if it did not exist.');

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
