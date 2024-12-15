<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900" style="min-height: calc(100vh - 9rem);">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
      </svg>
      
      <h2 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Check your email
      </h2>
      
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        We sent you a verification email. Click the link in the email to verify your account.
      </p>
      
      <div class="mt-6">
        <button
          @click="resendEmail"
          :disabled="isLoading"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Sending...' : 'Resend verification email' }}
        </button>
      </div>

      <div class="mt-4">
        <NuxtLink 
          to="/login" 
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Back to sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const isLoading = ref(false)

async function resendEmail() {
  isLoading.value = true
  try {
    const { error } = await client.auth.resend({
      type: 'signup'
    })
    if (error) throw error
    alert('Verification email has been resent!')
  } catch (err: any) {
    alert(err?.message || 'Failed to resend verification email')
  } finally {
    isLoading.value = false
  }
}
</script>
