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
        const { data: response } = await useFetch('/api/slides/list')
        if (response.value) {
          this.presentations = response.value as Presentation[]
        } else {
          this.presentations = []
        }
      } catch (error: any) {
        console.error('Error fetching presentations:', error)
        this.error = error?.message || 'Failed to fetch presentations'
        this.presentations = []
      } finally {
        this.loading = false
      }
    },
    
    async generatePresentation(prompt: string) {
      this.loading = true
      this.error = null
      try {
        const { data: response } = await useFetch('/api/slides/generate', {
          method: 'POST',
          body: { prompt }
        })
        if (response.value) {
          this.currentPresentation = response.value as Presentation
          await this.fetchPresentations()
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
