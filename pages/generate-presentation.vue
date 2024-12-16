<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">AI Presentation Generator</h1>
    
    <!-- Error Alert -->
    <div 
      v-if="store.error" 
      class="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded dark:text-red-200 dark:bg-red-800 dark:border-red-700"
    >
      {{ store.error }}
    </div>
    
    <!-- Generation Form -->
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Create New Presentation</h2>
      
      <div class="space-y-4">
        <label for="prompt" class="block text-sm font-medium text-gray-700">
          Describe your presentation topic and requirements...
        </label>
        <textarea
          id="prompt"
          v-model="prompt"
          rows="4"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          :disabled="isGenerating"
          placeholder="Enter your presentation topic or outline..."
        ></textarea>
      </div>

      <!-- Status and Error Messages -->
      <div v-if="generationStatus || error" class="mt-4">
        <div v-if="generationStatus" class="flex items-center space-x-3 text-gray-700">
          <div v-if="isGenerating" class="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
          <span>{{ generationStatus }}</span>
        </div>
        <div v-if="error" class="mt-4 space-y-4">
          <div class="bg-red-50 border-l-4 border-red-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <!-- Error icon -->
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <div class="text-sm text-red-700 whitespace-pre-line">{{ error }}</div>
              </div>
            </div>
          </div>
          
          <!-- Retry button -->
          <button
            v-if="error && !isGenerating"
            @click="generatePresentation"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>

      <!-- Generate Button -->
      <button
        @click="generatePresentation"
        :disabled="isGenerating || !prompt.trim()"
        class="mt-4 px-4 py-2 rounded-md text-white font-semibold transition-all duration-200"
        :class="{
          'bg-indigo-600 hover:bg-indigo-700': !isGenerating && prompt.trim(),
          'bg-gray-400 cursor-not-allowed': isGenerating || !prompt.trim()
        }"
      >
        <span v-if="!isGenerating">Generate Presentation</span>
        <span v-else>Generating...</span>
      </button>
    </div>

    <!-- Presentations List -->
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Your Presentations</h2>
        <button 
          :disabled="store.loading"
          @click="store.fetchPresentations"
          class="px-3 py-2 text-gray-700 bg-gray-100 rounded shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
        >
          <span v-if="store.loading" class="inline-block animate-spin mr-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </span>
          Refresh
        </button>
      </div>

      <div v-if="store.loading" class="py-8 text-center">
        <svg class="mx-auto w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <p class="mt-2 text-gray-500">Loading presentations...</p>
      </div>

      <div v-else-if="!store.presentations?.length" class="py-8 text-center">
        <p class="text-gray-500 dark:text-gray-400">No presentations yet. Create your first one!</p>
      </div>

      <div v-else class="grid gap-4">
        <div 
          v-for="presentation in store.presentations" 
          :key="presentation.id"
          @click="viewPresentation(presentation)"
          class="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 rounded dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ presentation.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Created {{ new Date(presentation.createdAt).toLocaleString() }}
              </p>
            </div>
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePresentationsStore } from '~/stores/presentations';

const store = usePresentationsStore();
const prompt = ref('')
const isGenerating = ref(false)
const generationStatus = ref('')
const error = ref('')

// Fetch presentations when the page is mounted
onMounted(() => {
  store.fetchPresentations()
})

async function generatePresentation() {
  if (!prompt.value.trim()) return

  try {
    isGenerating.value = true
    generationStatus.value = 'Starting presentation generation...'
    error.value = ''

    const response = await store.generatePresentation(prompt.value)
    console.log('Generated presentation:', response)
    const jobId = response.jobId

    // Start polling for completion
    const interval = setInterval(async () => {
      try {
        const statusResponse = await fetch(`/api/slides/status/${jobId}`)
        const statusData = await statusResponse.json()
        console.log('Status response:', statusData)

        if (statusData.status === 'Completed') {
          clearInterval(interval)
          generationStatus.value = 'Presentation generated successfully!'
          isGenerating.value = false
          
          // Show success message before navigation
          setTimeout(async () => {
            if (statusData.presentationId) {
              await navigateTo(`/presentation/${statusData.presentationId}`)
            }
          }, 1500) // Give user time to see the success message
        } else if (statusData.status === 'Failed') {
          clearInterval(interval)
          isGenerating.value = false
          error.value = 'Failed to generate presentation. This could be due to:';
          generationStatus.value = ''
          
          // Add retry button and error details
          const errorDetails = `
            • The content might be too complex
            • There might be an issue with the server
            • The AI model might need different input
          `;
          
          error.value = `${error.value}\n${errorDetails}\n\nPlease try again with a different prompt or try later.`;
        } else {
          generationStatus.value = 'Generating your presentation... This may take a minute.'
        }
      } catch (error) {
        console.error('Error checking status:', error)
        error.value = 'Error checking generation status. Please try again.'
        isGenerating.value = false
        clearInterval(interval)
      }
    }, 5000) // Poll every 5 seconds

  } catch (error) {
    console.error('Presentation generation failed:', error)
    error.value = 'Failed to generate presentation. Please try again.'
    isGenerating.value = false
  }
}

function viewPresentation(presentation: any) {
  store.setCurrentPresentation(presentation)
  navigateTo(`/presentation/${presentation.id}`, { replace: true })
}
</script>
