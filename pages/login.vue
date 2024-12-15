<template>
  <div class="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900" style="min-height: calc(100vh - 9rem);">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 class="mt-10 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        Sign in to your account
      </h2>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">{{ error }}</h3>
            </div>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Email address
          </label>
          <div class="mt-2">
            <input 
              v-model="email" 
              id="email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required
              class="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            >
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Password
          </label>
          <div class="mt-2">
            <input 
              v-model="password" 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password"
              required
              class="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            >
          </div>
        </div>

        <div>
          <button 
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Not a member? 
        <NuxtLink 
          to="/signup" 
          class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
        >
          Sign up now
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

// If user is already logged in, redirect to dashboard
if (user.value) {
  router.push('/dashboard')
}

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  error.value = ''
  isLoading.value = true

  try {
    const { error: authError } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) throw authError

    // Redirect to dashboard after successful login
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err?.message || 'An error occurred during sign in'
  } finally {
    isLoading.value = false
  }
}
</script>
