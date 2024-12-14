<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-2xl font-bold text-indigo-600">GetSlides</span>
            </NuxtLink>
          </div>
          <div class="flex items-center">
            <template v-if="user">
              <NuxtLink to="/dashboard" class="text-gray-700 hover:text-indigo-600 px-3 py-2">
                Dashboard
              </NuxtLink>
              <button @click="handleLogout" class="text-gray-700 hover:text-indigo-600 px-3 py-2">
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-gray-700 hover:text-indigo-600 px-3 py-2">
                Login
              </NuxtLink>
              <NuxtLink to="/signup" class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Sign up
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="bg-white mt-auto">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500">&copy; 2024 GetSlides. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

console.log('User state:', user);

// Debugging: Check if user is authenticated and log navigation
if (user.value) {
  console.log('User is authenticated, navigating to dashboard.');
} else {
  console.log('User is not authenticated, should have access to landing, login, and signup pages.');
}

async function handleLogout() {
  try {
    await client.auth.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
</script>
