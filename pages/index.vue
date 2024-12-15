<template>
  <div class="bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
    <!-- Hero Section with Motion -->
    <div 
      v-motion-fade
      class="relative isolate px-6 pt-14 lg:px-8 overflow-hidden"
    >
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div 
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
      
      <div class="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56 text-center">
        <div 
          v-motion-pop-bottom
          class="mb-8 flex justify-center"
        >
          <Icon 
            name="heroicons:presentation-chart-line" 
            class="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-4"
          />
        </div>
        
        <h1 
          v-motion-pop-bottom
          class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl mb-6"
        >
          Create Stunning Presentations <br>with AI in Minutes
        </h1>
        
        <p 
          v-motion-pop-bottom
          class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Transform your ideas into professional, engaging presentations powered by cutting-edge AI technology. No design skills required.
        </p>
        
        <div 
          v-motion-pop-visible-once 
          class="mt-10 flex items-center justify-center gap-x-6"
        >
          <NuxtLink 
            to="/signup" 
            class="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-xl transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Start Creating Free
          </NuxtLink>
          <NuxtLink 
            to="#features" 
            class="text-base font-medium leading-6 text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Learn more <Icon name="heroicons:arrow-right" class="inline w-5 h-5 ml-1" />
          </NuxtLink>
        </div>
      </div>
      
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div 
          class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
    </div>

    <!-- Features Section -->
    <div 
      id="features" 
      class="py-12 sm:py-28 bg-white dark:bg-gray-900"
    >
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 
            v-motion-pop-bottom
            class="text-lg md:text-2xl font-semibold text-indigo-600 dark:text-indigo-400"
          >
            Create Faster, Smarter
          </h2>
          <p 
            v-motion-pop-bottom
            class="mt-2 text-2xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl"
          >
            Revolutionize Your Presentation Workflow
          </p>
        </div>

        <div class="mx-auto mt-8 sm:mt-10 md:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
          <!-- Responsive Grid -->
          <div class="grid grid-cols-1 gap-y-6 md:gap-y-10 lg:grid-cols-3 lg:gap-8">
            <div 
              v-for="(feature, index) in features"
              :key="index"
              v-motion-pop-visible-once 
              class="flex flex-col p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div class="flex items-center mb-4 lg:flex-col lg:items-start lg:mb-6">
                <Icon 
                  :name="feature.icon" 
                  class="w-10 h-10 text-indigo-600 dark:text-indigo-400"
                />
                <h3 
                  class="ml-4 lg:ml-0 lg:mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  {{ feature.title }}
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="py-12 sm:py-20 bg-gray-50 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-xl text-center">
          <h2
            v-motion-pop-bottom
            class="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400"
          >
            Simple Process
          </h2>
          <p
            v-motion-pop-bottom
            class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl"
          >
            How GetSlides Works
          </p>
        </div>

        <div class="mt-12 sm:mt-16 lg:mt-20">
          <div class="grid grid-cols-1 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            <div
              v-for="(step, index) in steps"
              :key="index"
              v-motion-pop-visible-once
              class="flex flex-col text-center items-center"
            >
              <div class="flex items-center lg:flex-col lg:space-y-4">
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white text-lg font-bold lg:mb-4"
                >
                  {{ index + 1 }}
                </div>
                <Icon
                  :name="step.icon"
                  class="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 dark:text-indigo-400 ml-4 lg:ml-0"
                />
              </div>
              <h3
                class="mt-4 text-base font-medium text-gray-900 dark:text-gray-100 sm:text-lg"
              >
                {{ step.title }}
              </h3>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <!-- <div class="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 
            v-motion-pop-bottom
            class="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400"
          >
            Testimonials
          </h2>
          <p 
            v-motion-pop-bottom
            class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl"
          >
            What Our Users Say
          </p>
        </div>
        
        <div class="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              v-for="testimonial in testimonials" 
              :key="testimonial.name"
              v-motion-pop-visible-once 
              class="flex flex-col justify-between bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 sm:p-6 rounded-2xl"
            >
              <div>
                <p class="text-lg leading-6 text-gray-900 dark:text-gray-100">"{{ testimonial.quote }}"</p>
              </div>
              <div class="mt-6 flex items-center">
                <img class="h-12 w-12 rounded-full" :src="testimonial.avatar" :alt="testimonial.name">
                <div class="ml-4">
                  <p class="font-semibold text-gray-900 dark:text-gray-100">{{ testimonial.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ testimonial.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Pricing Section -->
    <div class="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 
            v-motion-pop-bottom
            class="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400"
          >
            Pricing
          </h2>
          <p 
            v-motion-pop-bottom
            class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl"
          >
            Choose Your Plan
          </p>
        </div>
        
        <div class="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 gap-x-8 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          <div 
            v-for="(plan, index) in pricingPlans" 
            :key="plan.name"
            v-motion-pop-visible-once 
            class="flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-700 sm:p-10 min-h-full"
            :class="{ 'z-10 scale-105': index === 1 }"
          >
            <div>
              <h3 class="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">{{ plan.name }}</h3>
              <div class="mt-4 flex items-baseline gap-x-2">
                <span class="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{{ plan.price }}</span>
              </div>
              <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                <li v-for="feature in plan.features" :key="feature" class="flex gap-x-3">
                  <Icon name="heroicons:check-circle" class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" />
                  {{ feature }}
                </li>
              </ul>
            </div>
            <a href="#" class="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Get started
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 
            v-motion-pop-bottom
            class="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400"
          >
            FAQ
          </h2>
          <p 
            v-motion-pop-bottom
            class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl"
          >
            Frequently Asked Questions
          </p>
        </div>
        
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div 
              v-for="faq in faqs" 
              :key="faq.question"
              v-motion-pop-visible-once 
              class="relative pl-16"
            >
              <dt class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <Icon name="heroicons:question-mark-circle" class="h-6 w-6 text-white" />
                </div>
                {{ faq.question }}
              </dt>
              <dd class="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{{ faq.answer }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  { title: 'AI-powered Content Generation', description: 'Generate professional, tailored content instantly using advanced AI algorithms trained on industry best practices.', icon: 'heroicons:bolt' },
  { title: 'Real-time Editing', description: 'Customize and refine your presentations in real-time with our intuitive, AI-assisted editing interface.', icon: 'heroicons:cursor-arrow-rays' },
  { title: 'Beautiful Design', description: 'Choose from a curated collection of modern, professional design templates that make your presentations stand out.', icon: 'heroicons:paint-brush' },
  { title: 'Custom Animations', description: 'Bring your slides to life with animations', icon: 'heroicons:film' },
  { title: 'One-click Export', description: 'Export to various formats easily, including PDF, PowerPoint, and more', icon: 'heroicons:arrow-down' }
];

const steps = [
  { title: 'Enter your topic', description: 'Provide the main idea for your presentation', icon: 'heroicons:pencil' },
  { title: 'AI generates content', description: 'Our AI creates slides and designs for you', icon: 'heroicons:cpu-chip' },
  { title: 'Customize and refine', description: 'Make adjustments to perfect your presentation', icon: 'heroicons:adjustments-horizontal' },
  { title: 'Present and share', description: 'Deliver your presentation with confidence', icon: 'heroicons:chart-bar' }
];

const testimonials = [
  { name: 'John Doe', title: 'Marketing Director', quote: 'GetSlides has transformed how we create presentations. It\'s a game-changer!', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Jane Smith', title: 'Sales Manager', quote: 'The AI-generated content saves me hours of work. Highly recommended!', avatar: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Mike Johnson', title: 'Startup Founder', quote: 'GetSlides helped us create investor pitches that stand out. Love it!', avatar: 'https://i.pravatar.cc/150?img=3' }
];

const pricingPlans = [
  { name: 'Free', price: '$0/month', features: ['5 presentations/month', 'Basic templates', 'Export to PDF'] },
  { name: 'Pro', price: '$10/month', features: ['200 presentations/month', 'All templates', 'All export options', 'Collaboration'] }
];

const faqs = [
  { question: 'How does the AI content generation work?', answer: 'Our AI analyzes your topic and generates relevant content and designs based on best practices and your preferences.' },
  { question: 'Can I use my own branding?', answer: 'Yes, you can customize colors, fonts, and logos to match your brand identity.' },
  { question: 'Is my data secure?', answer: 'We use industry-standard encryption and security measures to protect your data and presentations.' },
  { question: 'Can I cancel my subscription anytime?', answer: 'Yes, you can cancel your subscription at any time without any penalties.' }
];
</script>
