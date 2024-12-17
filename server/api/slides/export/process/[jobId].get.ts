import { defineEventHandler, createError } from 'h3'
import { createReadStream } from 'fs'
import { exportJobs } from '../../export-status/[jobId].get'

export default defineEventHandler(async (event) => {
  const jobId = event.context.params.jobId;
  const jobData = exportJobs[jobId];

  if (!jobData) {
    throw createError({
      statusCode: 404,
      message: 'Export job not found'
    });
  }

  if (jobData.status !== 'Completed') {
    throw createError({
      statusCode: 400,
      message: `Export is not ready (status: ${jobData.status})`
    });
  }

  if (!jobData.outputPath) {
    throw createError({
      statusCode: 500,
      message: 'PDF file path not found'
    });
  }

  // Set response headers for PDF download
  event.node.res.setHeader('Content-Type', 'application/pdf')
  event.node.res.setHeader('Content-Disposition', `attachment; filename="${jobData.filename || 'presentation.pdf'}"`)

  // Stream the PDF file
  return createReadStream(jobData.outputPath)
});
