<template>
  <div>
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">{{ presentation?.title || 'Loading...' }}</h1>
      <a 
        href="/" 
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to List
      </a>
    </div>

    <!-- Error Alert -->
    <div 
      v-if="error" 
      class="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded dark:text-red-200 dark:bg-red-800 dark:border-red-700"
    >
      {{ error }}
    </div>

    <!-- Presentation Card -->
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <!-- Card Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Presentation Content</h2>
        <div class="flex gap-2">
          <button
            @click="copyContent"
            :disabled="!presentation?.content"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m2 2H7m3-6h8M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"></path>
            </svg>
            Copy Content
          </button>
          <button
            @click="openInSlidev"
            :disabled="!presentation?.previewUrl"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            Open Presentation
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-8 text-center">
        <div class="flex justify-center">
          <div class="h-8 w-8 bg-gray-300 animate-pulse rounded-full dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!presentation" class="py-8 text-center text-gray-500 dark:text-gray-400">
        Presentation not found
      </div>

      <!-- Presentation Content -->
      <div v-else>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Markdown Content -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Markdown Content</h3>
            <pre class="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-100 rounded text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {{ presentation.content }}
            </pre>
          </div>
          <!-- Presentation Preview -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Presentation Preview</h3>
            <div v-if="presentation.previewUrl" class="bg-gray-100 p-4 rounded dark:bg-gray-700">
              <iframe 
                :src="presentation.previewUrl" 
                class="w-full h-[500px] border rounded dark:border-gray-600"
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            </div>
            <div v-else class="text-gray-500 text-center py-8 dark:text-gray-400">
              No preview available
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const store = usePresentationsStore()
const presentation = computed(() => store.currentPresentation)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!presentation.value) {
    loading.value = true
    error.value = null
    try {
      await store.fetchPresentations()
      console.log('Stored Presentations:', store.presentations);
      
      const found = store.presentations.find(p => p.id === route.params.id)
      if (found) {
        store.setCurrentPresentation(found)
      } else {
        error.value = 'Presentation not found'
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to load presentation'
    } finally {
      loading.value = false
    }
  }
})

function copyContent() {
  if (presentation.value?.content) {
    navigator.clipboard.writeText(presentation.value.content)
    // Add a toast notification or feedback here if needed
  }
}

function openInSlidev() {
  if (presentation.value?.previewUrl) {
    window.open(presentation.value.previewUrl, '_blank')
  }
}
</script>
