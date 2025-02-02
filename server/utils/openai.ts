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

export async function generateSlideContent(prompt: string) {
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
        content: `You are a presentation content generator. Generate a Markdown presentation using Slidev format.
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
        10. Only use code snippets when is a software related presentation
        11. Start the presentation with frontmatter that inclues: theme, title, date and transition 
        11. Include interactive content with 'v-click' animations.
        12. When you use a <div> element, inside you MUST only use html elements, no markdown formatting.
        13. Use transitions to create a dynamic and engaging presentation.
        14. Only use <div> elements when you use 'v-click', otherwise use normal markdown.
        15. Where you use markdown use ** to highlight important words or concepts.
        16. Use either of these layouts on each slide: (default, center, fact, full, two-cols, two-cols-header). Use them interchangably depending on the content.

        The 'v-click' elements are used to display elements at a time, giving the users the impression of an interactive presentation.
        Use 'v-clik' when you list items (But do not overuse in all slidse).
        You can add \`v-click\` to elements to add a click animation.

        The following example shows how to use \`v-click\`:

        These are the elements that will be animated:
        <div v-click>
          <b>Element 1</b> Some more text.
        </div>
        <div v-click>
          <b>Element 2</b> Some more text.
        </div>
        <div v-click>
          <b>Element 3</b> Some more text.
        </div>
        <div v-click>This shows up when you click the slide.</div>

        The transitions are placed in the beginning of each slide in the following format:
        ---
        transition: fade-out
        ---

        The layout is placed in the beginning of each slide after the transitions in the following format:
        ---
        transition: fade-out
        layout: center
        ---

        The two-cols and two-cols-header layouts are used as follows:

        ---
        layout: two-cols
        ---

        # Left

        This shows on the left

        ::right::

        # Right

        This shows on the right

        ---
        layout: two-cols-header
        ---

        # Title

        ::left::

        # Left subtitle

        This shows on the left

        ::right::

        # Righ subtitle

        This shows on the right

        Note: Only the first slide doesnt need a layout. The first slide should contain the following frontmatter:
        ---
        theme: default
        background: https://cover.sli.dev
        title: Presentation Title
        date: Date
        transition: fade-out
        ---

        The available themes are: default, bricks, seriph and dracula. (Choose one randomly)

        The speaker notes are placed at the end of each slide in the following format:
        <!--
        Note 1
        Note 2
        -->
        ---
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
    if (!content) {
      throw new Error('No content generated by OpenAI')
    }
    
    return cleanMarkdownContent(content)
  } catch (error: any) {
    console.error('Error in generateSlideContent:', error);
    if (error.response) {
      console.error('OpenAI API error:', error.response.data);
    }
    throw new Error(`Failed to generate slide content: ${error.message}`)
  }
}
