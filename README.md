# GetSlides

GetSlides is a modern web application that automatically generates beautiful presentations using AI. Built with Nuxt.js and powered by Slidev, it allows users to create professional-looking slides from simple text prompts.

## Features

- AI-Powered Slide Generation
- Beautiful, Modern Slide Designs
- Real-time Preview
- Responsive Design
- Multiple Theme Support

## Tech Stack

- **Frontend**: Nuxt.js 3, Vue.js, TailwindCSS, PrimeVue
- **Presentation Engine**: Slidev
- **AI Integration**: OpenAI
- **Authentication**: Supabase

## Prerequisites

- Node.js (Latest LTS version recommended)
- bun, yarn, or pbun

## Setup

1. Install dependencies:

```bash
# Using bun
bun install

# Using pbun
pbun install

# Using yarn
yarn install
```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key

   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_DB_PASSWORD=your_supabase_db_password
   ```

3. Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
# Generate static files
bun run generate

# Build for production
bun run build

# Start production server
bun run start
```
