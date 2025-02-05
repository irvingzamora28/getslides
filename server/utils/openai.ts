import OpenAI from 'openai'

// Create OpenAI client factory function
export function createOpenAIClient() {
  const config = useRuntimeConfig()
  return new OpenAI({
    apiKey: config.openaiApiKey,
  })
}

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

  // Clean up newlines between '---' markers
  const cleanedLines: string[] = [];
  let previousLineWasSeparator = false;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === '---') {
      cleanedLines.push(trimmedLine);
      previousLineWasSeparator = true;
    } else {
      if (previousLineWasSeparator && trimmedLine === '') {
        // Skip empty lines after a separator
        continue;
      }
      cleanedLines.push(line);
      previousLineWasSeparator = false;
    }
  }
  
  // Identify the first frontmatter section and clean the title
  const frontmatterRegex = /^---\s*$/;
  let insideFrontmatter = false;
  for (let i = 0; i < cleanedLines.length; i++) {
    const line = cleanedLines[i];
    if (frontmatterRegex.test(line)) {
      insideFrontmatter = !insideFrontmatter; // Toggle frontmatter state
    }
    if (insideFrontmatter && line.startsWith('title: ')) {
      const title = line.replace(/^title: /, '').trim();
      // Remove unwanted characters
      const cleanedTitle = title.replace(/[#:\/\?*|<>]/g, '');
      cleanedLines[i] = `title: ${cleanedTitle}`;
    }
  }
  
  // Join lines back together
  return cleanedLines.join('\n').trim();
}

export async function generateSlideContent(prompt: string, numSlides: number = 10) {
  try {
    const openai = createOpenAIClient()
    const config = useRuntimeConfig()
    
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API key is not configured')
    }
    
    console.log('Inside openai.ts@generateSlideContent - Before actually Generating slide content...');
    console.log('Using OpenAI model:', config.openaiModel);
  
    const completion = await openai.chat.completions.create({
    model: config.openaiModel,
    messages: [
      {
        role: 'system',
        content: `You are a presentation content generator. Generate exactly ${numSlides} slides using Slidev format.
        Follow these rules:
        1. Use clear and concise language
        2. Include speaker notes where appropriate
        3. Use Markdown formatting for emphasis
        4. Structure content with clear hierarchy
        5. Include code snippets if relevant
        6. Format as proper Slidev markdown
        7. Do not wrap the content in markdown code blocks
        8. Do not use image placeholders
        9. Do not use "Slide No X" as title
        10. Only use code snippets when is a software related presentation (Anything that is not software related, do not use code snippets)
        11. Start the presentation with frontmatter that includes:
            - theme: (default, seriph, bricks, or dracula)
            - title: Presentation Title
            - date: Current date (YYYY-MM-DD)
            - transition: (fade-out, slide-up, or zoom-in)
        12. Include interactive content with 'v-click' animations
        13. When using <div> elements for v-click, only use HTML formatting inside
        14. Use transitions between slides
        15. Use appropriate layouts (default, center, two-cols, etc)
        16. Maintain consistent heading hierarchy

        Example Structure 1:
        ---
        theme: seriph
        title: Modern Web Development
        date: 2024-03-15
        transition: slide-up
        ---

        # Core Principles

        <div v-click>
          <h2>1. Performance</h2>
          <p>Optimize critical rendering path</p>
        </div>

        <div v-click>
          <h2>2. Accessibility</h2>
          <p>Follow WCAG guidelines</p>
        </div>

        <!--
        Speaker Notes:
        - Emphasize performance metrics
        - Discuss accessibility auditing tools
        -->

        ---
        layout: two-cols
        transition: zoom-in
        ---

        # Client-Side vs Server-Side

        ::left::
        **Client-Side**
        - React/Vue components
        - Dynamic updates

        ::right::
        **Server-Side**
        - API endpoints
        - Database interactions

        Example Structure 2:
        ---
        theme: dracula
        title: DevOps Pipeline
        layout: center
        ---

        # CI/CD Flow

        \`\`\`mermaid
        graph LR
          A[Code Commit] --> B[Build]
          B --> C[Test]
          C --> D[Deploy]
        \`\`\`

        <!--
        Speaker Notes:
        - Explain each pipeline stage
        - Show failure recovery process
        -->

        ---
        transition: fade-out
        ---

        # Key Metrics

        <div v-click>
          Deployment frequency
        </div>
        <div v-click>
          Lead time for changes
        </div>
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
    console.log('Inside openai.ts@generateSlideContent - After Generating slide content and before returning it...');
    console.log('Generated slide content:', content);

    // Validate generated content
    if (!content) {
      throw new Error('No content generated by OpenAI')
    }

    if (!content.includes('---')) {
      throw new Error('Missing frontmatter section')
    }

    if (!content.match(/^title:\s+.+$/m)) {
      throw new Error('Missing title in frontmatter')
    }

    // Validate slide count
    const slideCount = (content.match(/^---$/gm) || []).length
    console.log('Slide count:', slideCount);
    
    // if (slideCount !== numSlides) {
    //   throw new Error(`Generated ${slideCount} slides instead of requested ${numSlides}`)
    // }

    const cleanedContent = cleanMarkdownContent(content)
    return cleanedContent
  } catch (error: any) {
    console.error('Error in generateSlideContent:', error);
    if (error.response) {
      console.error('OpenAI API error:', error.response.data);
    }
    throw new Error(`Failed to generate slide content: ${error.message}`)
  }
}
