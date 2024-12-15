<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900" style="min-height: calc(100vh - 9rem);">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <form class="space-y-6" @submit.prevent="handleSignup">
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
              class="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            >
          </div>
        </div>

        <div>
          <button 
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 transition"
          >
            Sign up
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
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

async function handleSignup() {
  try {
    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value,
        },
      },
    })

    if (error) throw error

    // Redirect to dashboard after successful signup
    router.push('/dashboard')
  } catch (error) {
    console.error('Error signing up:', error)
    // Here you would typically show an error message to the user
  }
}
</script>
