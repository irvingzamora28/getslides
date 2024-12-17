<!-- ~/components/Toast.vue -->
<template>
    <div 
      v-if="toastMessage" 
      class="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out"
    >
      <div 
        :class="[
          'px-4 py-2 rounded-lg shadow-lg text-white',
          toastClasses[toastMessage.type]
        ]"
      >
        {{ toastMessage.message }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useToast } from '~/composables/useToast'
  
  const { toastMessage } = useToast()
  
  const toastClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  </script>