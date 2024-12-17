import { defineEventHandler } from 'h3';

// In-memory store for export jobs
const exportJobs: Record<string, { status: string; error?: string }> = {};

export { exportJobs };

export default defineEventHandler(async (event) => {
  const jobId = event.context.params.jobId;
  console.log('Checking export status for job:', jobId);
  
  return exportJobs[jobId] || { status: 'Not Found' };
});
