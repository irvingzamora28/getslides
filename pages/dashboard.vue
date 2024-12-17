<template>
  <div class="space-y-6 px-6 py-8 md:px-24 dark:text-gray-100 dark:bg-gray-900" style="min-height: calc(100vh - 9rem);">

    <!-- Generate Presentation Form -->
    <form @submit.prevent="generatePresentation" class="space-y-4">
      <textarea v-model="prompt" placeholder="What would you like your presentation to be about?" class="w-full p-2 border rounded" required></textarea>
      <button 
        type="submit" 
        :disabled="isGenerating || !prompt.trim()"
        class="inline-flex items-center px-4 py-2 rounded-md text-white font-semibold transition-all duration-200"
        :class="{
          'bg-indigo-600 hover:bg-indigo-700': !isGenerating && prompt.trim(),
          'bg-gray-400 cursor-not-allowed': isGenerating || !prompt.trim()
        }"
      >
        <span v-if="!isGenerating">Generate Presentation</span>
        <span v-else>Generating...</span>
      </button>

      <!-- Generation Status -->
      <div v-if="generationStatus || error" class="mt-4">
        <div v-if="generationStatus" class="flex items-center space-x-3 text-gray-700">
          <div v-if="isGenerating" class="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
          <span>{{ generationStatus }}</span>
        </div>
        <div v-if="error" class="text-red-500 whitespace-pre-line">{{ error }}</div>
      </div>
    </form>

    <!-- Stats Section -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
        <div class="p-6 flex items-center">
          <div class="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900 rounded-md">
            <svg class="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Presentations</dt>
            <dd class="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">4</dd>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
        <div class="p-6 flex items-center">
          <div class="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900 rounded-md">
            <svg class="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</dt>
            <dd class="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">2.4k</dd>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
        <div class="p-6 flex items-center">
          <div class="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900 rounded-md">
            <svg class="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created This Month</dt>
            <dd class="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">4</dd>
          </div>
        </div>
      </div>
    </div>

    <!-- List of Presentations -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Your Presentations</h2>
      <div v-if="store.loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
      </div>
      <ul v-else class="space-y-2">
        <li v-for="presentation in store.presentations" :key="presentation.id" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 class="font-bold">{{ presentation.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Created {{ new Date(presentation.createdAt).toLocaleString() }}</p>
          <button 
            @click="navigateTo(`/presentation/${presentation.id}`)"
            class="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            View Presentation
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePresentationsStore } from '~/stores/presentations'

const store = usePresentationsStore()
const prompt = ref('')
const isGenerating = ref(false)
const generationStatus = ref('')
const error = ref('')

const generatePresentation = async () => {
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

// Fetch presentations when the page is mounted
onMounted(() => {
  store.fetchPresentations()
})
</script>

<style scoped>
/* Add any styles you need */
</style>