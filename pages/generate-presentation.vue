<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Generate Presentation</h1>
    <textarea
      v-model="prompt"
      placeholder="Enter your prompt here..."
      class="w-full max-w-md p-4 border rounded-md dark:bg-gray-800 dark:text-gray-200"
      rows="10"
    ></textarea>
    <button
      @click="handleGenerate"
      class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
    >
      Generate
    </button>
    <div v-if="output" class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md shadow-md w-full max-w-md">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Generated Presentation:</h2>
      <pre class="mt-2 text-gray-700 dark:text-gray-300">{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePresentationsStore } from '~/stores/presentations'

const store = usePresentationsStore()

const prompt = ref('');
const output = ref('');

async function handleGenerate() {
  if (!prompt.value.trim()) return

  try {
    await store.generatePresentation(prompt.value)
    prompt.value = '' // Clear prompt after successful generation
    navigateTo(`/presentation/${store.currentPresentation?.id}`)
  } catch (error: any) {
    console.error('Presentation generation failed', error)
  }
  }
</script>
