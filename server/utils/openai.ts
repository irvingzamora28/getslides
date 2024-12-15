import OpenAI from 'openai'
import { useRuntimeConfig } from '#imports'

export const openai = new OpenAI({
  apiKey: useRuntimeConfig().openaiApiKey,
})

function cleanMarkdownContent(content: string): string {
  // Split content into lines
  let lines = content.split('\n')
  
  // Remove leading empty lines
  while (lines.length > 0 && lines[0].trim() === '') {
    lines.shift()
  }
  
  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop()
  }
  
  // Remove opening markdown fence if present
  if (lines[0]?.trim().startsWith('```')) {
    lines = lines.slice(1)
  }
  
  // Remove closing markdown fence if present
  if (lines[lines.length - 1]?.trim().startsWith('```')) {
    lines = lines.slice(0, -1)
  }
  
  // Join lines back together
  return lines.join('\n').trim()
}

export async function generateSlideContent(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: useRuntimeConfig().openaiModel,
    messages: [
      {
        role: 'system',
        content: `You are a presentation content generator. Generate a Markdown presentation using Slidev format.
        Follow these rules:
        1. Use clear and concise language
        2. Include speaker notes where appropriate
        3. Use Markdown formatting for emphasis
        4. Structure content with clear hierarchy
        5. Include code snippets if relevant
        6. Add image placeholders if needed
        7. Format as proper Slidev markdown
        8. Do not wrap the content in markdown code blocks
        9. Do not use image placeholders
        `
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  const content = completion.choices[0].message.content
  if (!content) return ''
  
  return cleanMarkdownContent(content)
}
