// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/icon',
    '@vueuse/motion/nuxt',
    '@pinia/nuxt',
    '@primevue/nuxt-module'
  ],
  primevue: {
    options: {
        theme: {
            preset: Aura,
            options: {
              darkModeSelector: '.dark',
          }
        }
    },
    usePrimeVue: true
},
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/signup']
    }
  },
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiModel: 'gpt-4o-mini',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    public: {
      motion: {
        directives: {
          'pop-bottom': {
            initial: {
              scale: 0,
              opacity: 0,
              y: 100,
            },
            visibleOnce: {
              scale: 1,
              opacity: 1,
              y: 0,
            }
          }
        }
      }
    },
    private: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    }
  },
  nitro: {
    storage: {
      presentations: {
        driver: 'fs',
        base: './storage/presentations'
      }
    },
    // Add static file serving for presentations
    routeRules: {
      '/presentations/**': { static: true, prerender: true },
      '/dashboard': { middleware: ['auth'] },
     '/api/**': {
      middleware: ['api-auth'],
      cors: true,
      headers: {
        'Access-Control-Allow-Headers': 'authorization',
        'Access-Control-Allow-Origin': '*'
      }
    }
    }
  },
  app: {
    head: {
      title: 'GetSlides - AI Presentation Generator',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Create engaging presentations with AI' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})