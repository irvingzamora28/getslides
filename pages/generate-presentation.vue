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
      
      <form @submit.prevent="generatePresentation">
        <textarea
          v-model="prompt"
          rows="4"
          placeholder="Describe your presentation topic and requirements..."
          class="w-full p-3 mb-4 border border-gray-300 rounded shadow-sm text-gray-700 placeholder-gray-400 focus:ring-indigo-600 focus:border-indigo-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-gray-200"
        ></textarea>
        
        <button 
          type="submit"
          :disabled="!prompt || store.loading"
          class="px-4 py-2 text-white bg-indigo-600 rounded shadow hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <span v-if="store.loading" class="inline-block animate-spin mr-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </span>
          Generate Presentation
        </button>
      </form>
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
import { ref, onMounted } from 'vue'
import { usePresentationsStore } from '~/stores/presentations'

const store = usePresentationsStore()
const prompt = ref('')

// Fetch presentations when the page is mounted
// onMounted(() => {
//   store.fetchPresentations()
// })

async function generatePresentation() {
  if (!prompt.value.trim()) return

  try {
    const presentation = await store.generatePresentation(prompt.value)
    console.log('Generated Presentation:', presentation);
    
    prompt.value = '' // Clear prompt after successful generation
    
    // if (presentation?.id) {
    //   await navigateTo(`/presentation/${presentation.id}`, { replace: true })
    // } else {
    //   console.error('No presentation ID received after generation')
    // }
  } catch (error: any) {
    console.error('Presentation generation failed:', error)
  }
}

function viewPresentation(presentation: any) {
  store.setCurrentPresentation(presentation)
  navigateTo(`/presentation/${presentation.id}`, { replace: true })
}
</script>
