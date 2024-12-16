import { defineEventHandler } from 'h3';
import { jobs } from '../jobs'; // Adjust the import path

export default defineEventHandler(async (event) => {
  // Access the jobId from the route parameters
  const jobId = event.context.params.jobId;
  console.log('Checking status for job:', jobId); // Debug log
  
  const jobStatus = jobs[jobId] || { status: 'Not Found' };
  return jobStatus;
});
