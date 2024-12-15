<template>
  <div class="space-y-6 px-6 py-8 md:px-24 dark:text-gray-100 dark:bg-gray-900" style="min-height: calc(100vh - 9rem);">
    <!-- Welcome Section -->
    <div class="hidden md:block bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back!</h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Here's an overview of your presentations
      </p>
    </div>

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

    <!-- Recent Presentations Section -->
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Presentations</h2>
        <div class="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="(presentation, index) in recentPresentations" 
            :key="index" 
            class="py-4 flex items-center justify-between"
          >
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ presentation.title }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Created {{ presentation.date }}
              </p>
            </div>
            <button 
              class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const recentPresentations = ref([
  { title: 'Q4 2024 Business Review', date: '2 days ago' },
  { title: 'Product Launch Strategy', date: '5 days ago' },
  { title: 'Team Updates', date: '1 week ago' },
  { title: 'Market Analysis', date: '2 weeks ago' },
])
</script>
