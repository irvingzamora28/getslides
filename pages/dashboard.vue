<template>
  <div 
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300"
    v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
  >
    <div class="max-w-4xl mx-auto space-y-4 md:space-y-8">
      <!-- Header (Previous implementation) -->
      <div class="text-center mb-2 md:mb-8">
        <h1 
          class="text-2xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-0 md:mb-4"
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 200 } }"
        >
          Presentation AI Generator
        </h1>
        <p class="hidden md:block text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Transform your ideas into stunning presentations with AI-powered generation
        </p>
      </div>

      <!-- Generation Form (Previous implementation) -->
      <div 
        class="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 md:p-8"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 300 } }"
      >
        <form @submit.prevent="generatePresentation" class="space-y-4">
          <div class="relative">
            <textarea 
              v-model="prompt" 
              placeholder="Describe the presentation topic, style, or key points..." 
              class="w-full p-4 pr-12 border-2 border-indigo-100 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 transition-all duration-300"
              rows="4"
              required
            ></textarea>
            <Icon 
              name="material-symbols:auto-stories" 
              class="absolute right-4 top-4 text-indigo-500 dark:text-indigo-400 text-2xl"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isGenerating || !prompt.trim()"
            class="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
            :class="{
              'bg-indigo-600 hover:bg-indigo-700': !isGenerating && prompt.trim(),
              'bg-gray-400 cursor-not-allowed': isGenerating || !prompt.trim()
            }"
          >
            <Icon 
              v-if="!isGenerating" 
              name="material-symbols:rocket-launch" 
              class="mr-2"
            />
            <span v-if="!isGenerating">Generate Presentation</span>
            <div v-else class="flex items-center space-x-2">
              <div class="animate-pulse">
                <Icon name="line-md:uploading-loop" class="text-xl" />
              </div>
              <span>Generating...</span>
            </div>
          </button>
        </form>
      </div>

      <!-- Status Modal -->
      <Teleport to="body">
        <div 
          v-if="isGenerating || error"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 300 } }"
          :leave="{ opacity: 0, transition: { duration: 300 } }"
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl"
            v-motion
            :initial="{ scale: 0.9, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { duration: 400 } }"
          >
            <div v-if="isGenerating" class="space-y-6">
                <!-- Animated Loading Illustration -->
                <div class="flex justify-center">
                    <div class="relative w-48 h-48">
                        <svg class="absolute inset-0 animate-spin" viewBox="0 0 100 100">
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="45" 
                                fill="none" 
                                stroke="currentColor" 
                                stroke-width="10" 
                                stroke-dasharray="280" 
                                stroke-dashoffset="200" 
                                class="text-indigo-200 dark:text-indigo-700"
                            />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="45" 
                                fill="none" 
                                stroke="currentColor" 
                                stroke-width="10" 
                                stroke-dasharray="280" 
                                stroke-dashoffset="280" 
                                class="text-indigo-600 dark:text-indigo-400 animate-spin-slow"
                            />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <Icon 
                                name="material-symbols:rocket-launch" 
                                class="text-6xl text-indigo-600 dark:text-indigo-400 animate-bounce"
                            />
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Generating Your Presentation
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        {{ generationStatus || 'Crafting your AI-powered slides...' }}
                    </p>
                </div>

                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                        class="bg-indigo-600 h-2.5 rounded-full animate-pulse"
                        :style="{ width: `${generationProgress}%` }"
                    ></div>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="space-y-4">
                <div class="flex justify-center mb-4">
                    <Icon 
                        name="material-symbols:error-outline" 
                        class="text-6xl text-red-500 animate-shake"
                    />
                </div>
                <h3 class="text-xl font-bold text-red-600">
                    Presentation Generation Failed
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ error }}
                </p>
                <button 
                    @click="resetError"
                    class="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Stats Section -->
      <div 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 400 } }"
      >
        <!-- Stats cards (existing implementation with added motion) -->
        <div 
          v-for="(stat, index) in stats" 
          :key="index" 
          class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300"
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 400, delay: 500 + index * 100 } }"
        >
          <div class="p-6 flex items-center">
            <div class="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900 rounded-md">
              <Icon :name="stat.icon" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</dt>
              <dd class="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stat.value }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Presentations List -->
      <div 
        class="mt-8"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 500 } }"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Presentations</h2>
        <div v-if="store.loading" class="flex justify-center py-8">
          <div class="animate-spin">
            <Icon name="line-md:loading-loop" class="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        <ul v-else-if="store.presentations.length" class="space-y-4">
          <li 
            v-for="presentation in store.presentations" 
            :key="presentation.id" 
            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center justify-between"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 400 } }"
          >
            <div>
              <h3 class="font-bold text-gray-800 dark:text-gray-100">{{ presentation.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Created {{ new Date(presentation.createdAt).toLocaleString() }}
              </p>
            </div>
            <button 
              @click="navigateTo(`/presentation/${presentation.id}`)"
              class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center space-x-1 hover:underline"
            >
              <Icon name="material-symbols:visibility" class="mr-1" />
              View
            </button>
          </li>
        </ul>
        <div v-else class="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Icon 
            name="material-symbols:folder-open" 
            class="mx-auto mb-4 text-4xl text-gray-400 dark:text-gray-600"
          />
          <p class="text-gray-500 dark:text-gray-400">
            No presentations created yet. Generate your first presentation!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePresentationsStore } from '~/stores/presentations'

const store = usePresentationsStore()
const prompt = ref('')
const isGenerating = ref(false)
const generationStatus = ref('')
const error = ref('')
const generationProgress = ref(0)

const generatePresentation = async () => {
  if (!prompt.value.trim()) return

  try {
    isGenerating.value = true
    generationStatus.value = 'Initializing presentation generation...'
    error.value = ''
    generationProgress.value = 10

    const response = await store.generatePresentation(prompt.value)
    const jobId = response.jobId

    const interval = setInterval(async () => {
      try {
        const statusResponse = await fetch(`/api/slides/status/${jobId}`)
        const statusData = await statusResponse.json()

        // Update progress dynamically
        generationProgress.value = Math.min(generationProgress.value + 20, 90)

        if (statusData.status === 'Completed') {
          clearInterval(interval)
          generationStatus.value = 'Presentation generated successfully!'
          generationProgress.value = 100
          isGenerating.value = false
          
          setTimeout(async () => {
            if (statusData.presentationId) {
              await navigateTo(`/presentation/${statusData.presentationId}`)
            }
          }, 1500)
        } else if (statusData.status === 'Failed') {
          clearInterval(interval)
          isGenerating.value = false
          error.value = 'Presentation generation encountered an issue.'
        } else {
          generationStatus.value = 'Crafting your AI-powered slides...'
        }
      } catch (error) {
        console.error('Error checking status:', error)
        error.value = 'Connection lost. Please try again.'
        isGenerating.value = false
        clearInterval(interval)
      }
    }, 5000)

  } catch (error) {
    console.error('Presentation generation failed:', error)
    error.value = 'Failed to initiate presentation generation.'
    isGenerating.value = false
  }
}

const resetError = () => {
  error.value = ''
}

onMounted(() => {
  store.fetchPresentations()
})

// Previous stats implementation
const stats = [
  { 
    label: 'Total Presentations', 
    value: '4', 
    icon: 'material-symbols:folder-copy'
  },
  { 
    label: 'Total Views', 
    value: '2.4k', 
    icon: 'material-symbols:visibility'
  },
  { 
    label: 'Created This Month', 
    value: '4/200', 
    icon: 'material-symbols:calendar-month'
  }
]
</script>

<style>
@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 4s linear infinite;
}
</style>