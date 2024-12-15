// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxt/icon', '@vueuse/motion/nuxt'],
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
    public: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
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