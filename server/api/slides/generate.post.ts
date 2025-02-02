import { generateSlideContent } from '~/server/utils/openai'
import { generateSlidevPresentation } from '~/server/utils/slidev'
import { defineEventHandler, readBody } from 'h3'
import { v4 as uuidv4 } from 'uuid'
import { useStorage } from '#imports'
import { jobs } from './jobs'; // Import the shared jobs object

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('generate.post.ts - Received body:', body);
    
    const parsedBody = JSON.parse(body);
    const prompt = parsedBody?.prompt;
    console.log('generate.post.ts - Extracted prompt:', prompt);
    
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required and must be a string')
    }

    const jobId = uuidv4(); // Generate a unique job ID
    jobs[jobId] = { status: 'Processing' }; // Initialize job status
    console.log('generate.post.ts - Before Start Presentation Generation - Job ID:', jobId);
    
    // Start the presentation generation process
    await startPresentationGeneration(prompt, jobId, event); // Make this await the promise

    return { jobId, status: 'Processing' };
  } catch (error: any) {
    console.error('Error in generate.post.ts:', error);
    console.error('Error stack:', error.stack);
    throw createError({
      statusCode: 500,
      message: `Generation failed: ${error.message}`
    })
  }
})

// Function to start the generation process
async function startPresentationGeneration(prompt, jobId, event) {
  try {
    console.log('Starting presentation generation... (PROMPT: ', prompt, ')');
    // Generate slide content
    const content = await generateSlideContent(prompt)
    console.log('Generated slide content:', content);

    // Create presentation metadata
    const presentation = {
      id: jobId,
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      content,
      createdAt: new Date().toISOString(),
      prompt
    }

    // Generate Slidev presentation
    const slidevResult = await generateSlidevPresentation(presentation.id, presentation.title, content, event)
    
    // Update presentation with Slidev details
    presentation.slidevPath = slidevResult.slidesPath
    presentation.previewUrl = slidevResult.previewUrl

    // Save to storage after successful generation
    const storage = useStorage('presentations')
    await storage.setItem(`${presentation.id}.json`, presentation)

    jobs[jobId].status = 'Completed'; // Update job status
    jobs[jobId].presentationId = presentation.id; // Store presentation ID
  } catch (error) {
    console.error('Error generating presentation:', error);
    jobs[jobId].status = 'Failed'; // Update job status on error
  }
}

// Endpoint to check status
export const getStatus = defineEventHandler(async (event) => {
  const { jobId } = event.context.params;
  const jobStatus = jobs[jobId] || { status: 'Not Found' }; // Return job status
  return jobStatus;
});

// Ensure to register this endpoint in your server setup
export const appSetup = (app) => {
  app.get('/api/slides/status/:jobId', getStatus);
};
