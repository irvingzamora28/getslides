import { defineStore } from 'pinia'

interface Presentation {
  id: string
  title: string
  content: string
  createdAt: string
  prompt: string
}

export const usePresentationsStore = defineStore('presentations', {
  state: () => ({
    presentations: [] as Presentation[],
    loading: false,
    error: null as string | null,
    currentPresentation: null as Presentation | null,
  }),
  
  actions: {
    async fetchPresentations() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/slides/list')
        console.log('Response straight up:', response);
        
        if (response) {
          console.log('Fetched presentations:', JSON.stringify(response, null, 2));
        } else {
          console.log('Fetched presentations: No response received');
        }
        
        if (Array.isArray(response)) {
          this.presentations = response as Presentation[]
        } else {
          this.presentations = []
        }
      } catch (error: any) {
        console.error('Error fetching presentations:', error);
        console.error(error); // Update the error handling to log any errors that occur during the fetch operation
        this.error = error?.message || 'Failed to fetch presentations'
        this.presentations = []
      } finally {
        this.loading = false
      }
    },
    
    async generatePresentation(prompt: string) {
      this.loading = true
      this.error = null
      console.log('Generating presentation with prompt:', prompt);
      
      try {
        if (!prompt?.trim()) {
          throw new Error('Prompt is required')
        }

        const trimmedPrompt = prompt.trim()
        console.log('Sending request with prompt:', trimmedPrompt)

        const { data, error } = await useFetch('/api/slides/generate', {
          method: 'POST',
          body: { prompt: trimmedPrompt }
        })

        if (error.value) {
          throw new Error(error.value.message || 'Failed to generate presentation')
        }

        if (!data.value) {
          throw new Error('No response data received')
        }

        console.log('Generated presentation:', data.value);
        
        const result = data.value
        if (result) {
          this.currentPresentation = result as Presentation
          return this.currentPresentation
        } else {
          throw new Error('Failed to generate presentation')
        }
      } catch (error: any) {
        console.error('Error generating presentation:', error)
        this.error = error?.message || 'Failed to generate presentation'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    setCurrentPresentation(presentation: Presentation) {
      this.currentPresentation = presentation
    }
  }
})
