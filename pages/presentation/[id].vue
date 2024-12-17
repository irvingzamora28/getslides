<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>

      <!-- Content -->
      <div v-else-if="presentation" class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ presentation.title }}
            </h1>
            <div class="flex space-x-4">
              <button
                @click="copyContent"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                  Copy Content
                </span>
              </button>
              <button
                @click="startPresentation"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
              >
                Start Presentation
              </button>
              <button
                @click="navigateTo('/dashboard')"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Back to List
              </button>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Created {{ new Date(presentation.createdAt).toLocaleString() }}
          </p>
          <span class="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <b>Nota:</b> Aqui se supone que vas a poder editar tu presentación y ver los cambios en tiempo real<br>
            <b>Nota:</b> Vas a poder agregar temas (estilos de diseño de la presentación)<br> 
            <b>Nota:</b>Vas a poder seleccionar un slide y pedirle a la IA que modifique el contenido.<br>
            Por ejemplo: "Incluye otros 3 ejemplos del tema" <br>
            Por ejemplo: "Amplia el contenido del slide actual"
          </span>
        </div>

        <!-- Content and Preview Grid -->
        <div class="grid md:grid-cols-2 gap-6 p-6">
          <!-- Markdown Content -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Markdown Content</h3>
            <pre class="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">{{ presentation.content }}</pre>
          </div>

          <!-- Preview -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Preview</h3>
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <iframe
                v-if="presentation.id"
                :src="`/presentations/${presentation.id}/index.html`"
                class="w-full h-[600px] rounded-lg"
                frameborder="0"
              ></iframe>
              <div v-else class="flex items-center justify-center h-[600px] text-gray-500 dark:text-gray-400">
                Preview not available
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Presentation not found</h2>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          The presentation you're looking for doesn't exist or has been removed.
        </p>
        <button
          @click="navigateTo('/dashboard')"
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
        >
          Back to List
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePresentationsStore } from '~/stores/presentations'

const route = useRoute()
const store = usePresentationsStore()

const loading = ref(true)
const error = ref<string | null>(null)
const presentation = computed(() => store.currentPresentation)

onMounted(async () => {
  try {
    // If we don't have the presentation in the store, fetch it
    if (!store.currentPresentation || store.currentPresentation.id !== route.params.id) {
      await store.fetchPresentations()
      const found = store.presentations.find(p => p.id === route.params.id)
      if (found) {
        store.setCurrentPresentation(found)
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load presentation'
  } finally {
    loading.value = false
  }
})

function startPresentation() {
  // Open the presentation in a new window
  window.open(`/presentations/${route.params.id}/index.html`, '_blank')
}

function copyContent() {
  if (presentation.value?.content) {
    navigator.clipboard.writeText(presentation.value.content)
    // You could add a toast notification here to show success
  }
}
</script>
