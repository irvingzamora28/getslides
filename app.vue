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

          <!-- Mobile Menu Toggle -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden p-2 focus:outline-none"
          >
            <Icon 
              :name="isMobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
              class="h-6 w-6 text-gray-600 dark:text-gray-200"
            />
          </button>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-4">
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

        <!-- Mobile Menu Dropdown -->
        <div 
          v-if="isMobileMenuOpen" 
          class="md:hidden absolute left-0 right-0 bg-white dark:bg-gray-800 shadow-lg"
        >
          <div class="px-4 pt-2 pb-4 space-y-2">
            <template v-if="user">
              <NuxtLink 
                to="/dashboard" 
                class="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-300 hover:bg-indigo-50 dark:text-gray-200"
                @click="toggleMobileMenu"
              >
                Dashboard
              </NuxtLink>
              <button 
                @click="handleLogout" 
                class="w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-300 hover:bg-indigo-50 dark:text-gray-200"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink 
                to="/login" 
                class="block text-indigo-700 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-300 hover:bg-indigo-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                @click="toggleMobileMenu"
              >
                Login
              </NuxtLink>
              <NuxtLink 
                to="/signup" 
                class="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg"
                @click="toggleMobileMenu"
              >
                Sign up
              </NuxtLink>
            </template>

            <!-- Mobile Dark Mode Toggle -->
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-gray-700 dark:text-gray-200">Dark Mode</span>
              <button 
                @click="toggleDarkMode" 
                class="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <span v-if="!isDarkMode">🌙</span>
                <span v-else>🌞</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <Toast />
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
          <!-- Placeholder for future links -->
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
const isMobileMenuOpen = ref(false)

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

async function handleLogout() {
  try {
    await client.auth.signOut()
    router.push('/login')
    isMobileMenuOpen.value = false
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