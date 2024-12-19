<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error! </strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <!-- Content -->
      <div v-else-if="presentation" class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 w-full">
              {{ presentation.title }}
            </h1>
            
            <div class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 w-full sm:w-auto justify-start sm:justify-end">
              <button
                @click="copyContent"
                class="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center justify-center w-full sm:w-auto"
              >
                <Icon name="heroicons:clipboard" class="w-4 h-4 mr-2" />
                Copy
              </button>
              <button
                @click="startPresentation"
                class="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center justify-center w-full sm:w-auto"
              >
               <Icon name="heroicons:play" class="w-4 h-4 mr-2" />
                Start
              </button>
            </div>
          </div>
          
          <p class="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Created {{ new Date(presentation.createdAt).toLocaleString() }}
          </p>
          
          <div class="hidden md:blockmt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
            <b>Notas:</b>
            <ul class="list-disc list-inside space-y-1 mt-2">
              <li>Aqui se supone que vas a poder editar tu presentación y ver los cambios en tiempo real</li>
              <li>Vas a poder agregar temas (estilos de diseño de la presentación)</li>
              <li>Vas a poder seleccionar un slide y pedirle a la IA que modifique el contenido</li>
              <p class="text-xs text-gray-600 ml-4 mt-1">
                  Por ejemplo: "Incluye otros 3 ejemplos del tema" 
                </p>
                <p class="text-xs text-gray-600 ml-4 mt-1">
                  Por ejemplo: "Amplia el contenido del slide actual"
                </p>
            </ul>
          </div>
        </div>

        <!-- Content and Preview Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
          <!-- Markdown Content -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Markdown Content
            </h3>
            <div class="max-h-[500px] overflow-auto">
              <pre class="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
{{ presentation.content }}
              </pre>
            </div>
          </div>

          <!-- Preview -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Preview
            </h3>
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <iframe
                v-if="presentation.id"
                :src="`/presentations/${presentation.id}/`"
                class="w-full aspect-video rounded-lg"
                frameborder="0"
              ></iframe>
              <div 
                v-else 
                class="flex items-center justify-center h-[300px] sm:h-[600px] text-gray-500 dark:text-gray-400"
              >
                Preview not available
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Presentation not found
        </h2>
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
import { ref, onMounted, computed, inject } from 'vue';
import { usePresentationsStore } from '~/stores/presentations'
import Toast from 'primevue/toast';

const route = useRoute()
const store = usePresentationsStore()
const toast = inject('toast'); // Inject the toast reference

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
  window.open(`/presentations/${route.params.id}/`, '_blank')
}

const showToast = (severity, summary, detail) => {
  if (toast.value) {
    toast.value.add({ severity, summary, detail, life: 1000 });
  } else {
    console.error('Toast reference is not set.');
  }
};

function copyContent() {
  if (presentation.value?.content) {
    navigator.clipboard.writeText(presentation.value.content)
    showToast('secondary', 'Copied!', 'Content copied to clipboard')
  }
}
</script>