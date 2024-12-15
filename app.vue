<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50 transition-colors duration-300">
    <header class="sticky top-0 z-40 bg-white shadow-md dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink 
            to="/" 
            class="flex items-center space-x-2 group transition duration-300"
          >
            <Icon 
            name="heroicons:presentation-chart-line" 
            class="h-8 w-8 text-indigo-600 dark:text-gray-200 group-hover:rotate-6 group-hover:text-indigo-800 transition"
          />
            <span class="text-2xl font-bold text-indigo-600 dark:text-gray-200 group-hover:text-indigo-800 transition">
              GetSlides
            </span>
          </NuxtLink>

          <nav class="flex items-center space-x-4">
            <template v-if="user">
              <div class="flex items-center space-x-4">
                <NuxtLink 
                  to="/dashboard" 
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-300 hover:bg-indigo-50"
                >
                  Dashboard
                </NuxtLink>
                <button 
                  @click="handleLogout" 
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-300 hover:bg-indigo-50"
                >
                  Logout
                </button>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/login" 
                class="text-indigo-700 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-300 hover:bg-indigo-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Login
              </NuxtLink>
              <NuxtLink 
                to="/signup" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign up
              </NuxtLink>
            </template>

            <!-- Dark Mode Toggle -->
            <button @click="toggleDarkMode" class="ml-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800">
              <span v-if="!isDarkMode">🌙</span>
              <span v-else>🌞</span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <NuxtPage class="animate-fadeIn" />
    </main>

    <footer class="bg-white border-t border-gray-100 mt-auto dark:bg-gray-800">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="flex items-center space-x-2">
          <Icon 
            name="heroicons:presentation-chart-line" 
            class="h-8 w-8 text-indigo-600 dark:text-gray-200"
          />
          <span class="text-lg font-semibold text-indigo-600 dark:text-gray-200">GetSlides</span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
          &copy; 2024 GetSlides. All rights reserved.
        </p>
        <nav class="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <!-- <NuxtLink to="/privacy" class="hover:text-indigo-600 transition">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-indigo-600 transition">Terms</NuxtLink> -->
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()

const isDarkMode = ref(false)

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

async function handleLogout() {
  try {
    await client.auth.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
</style>