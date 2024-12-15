<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900" style="min-height: calc(100vh - 9rem);">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <form class="space-y-6" @submit.prevent="handleSignup">
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
          <label for="name" class="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Full name
          </label>
          <div class="mt-2">
            <input 
              v-model="name" 
              id="name" 
              name="name" 
              type="text" 
              required
              class="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            >
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
              autocomplete="new-password" 
              required
              minlength="8"
              @input="validatePassword"
              class="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            >
          </div>
          <div v-if="password" class="mt-2 space-y-2">
            <p class="text-xs" :class="passwordLength ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              • At least 8 characters
            </p>
            <p class="text-xs" :class="passwordUppercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              • At least one uppercase letter
            </p>
            <p class="text-xs" :class="passwordNumber ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              • At least one number
            </p>
          </div>
        </div>

        <div>
          <button 
            type="submit"
            :disabled="isLoading || !isPasswordValid"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Creating account...' : 'Sign up' }}
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account? 
        <NuxtLink 
          to="/login" 
          class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
        >
          Sign in
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

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

// Password validation
const passwordLength = ref(false)
const passwordUppercase = ref(false)
const passwordNumber = ref(false)

const isPasswordValid = computed(() => 
  passwordLength.value && passwordUppercase.value && passwordNumber.value
)

function validatePassword() {
  const pass = password.value
  passwordLength.value = pass.length >= 8
  passwordUppercase.value = /[A-Z]/.test(pass)
  passwordNumber.value = /[0-9]/.test(pass)
}

async function handleSignup() {
  if (!isPasswordValid.value) {
    error.value = 'Please ensure your password meets all requirements'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const { error: signUpError, data } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value,
        },
      },
    })

    if (signUpError) throw signUpError

    // Check if email confirmation is required
    if (data?.user && !data.session) {
      router.push('/verify-email')
    } else {
      // If no email confirmation required, redirect to dashboard
      router.push('/dashboard')
    }
  } catch (err: any) {
    error.value = err?.message || 'An error occurred during sign up'
  } finally {
    isLoading.value = false
  }
}
</script>
