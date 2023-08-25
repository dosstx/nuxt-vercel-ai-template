// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxthq/ui', '@nuxt/image'],
  nitro: {
    preset: "netlify_edge",
    minify: false,
  },
  devtools: {
    enabled: false,
  },
  runtimeConfig: {
    OPENAI_API_KEY: "",
    public: {
      baseURL: process.env.NODE_ENV === 'production' ? 'https://main--chipper-snickerdoodle-13271f.netlify.app' : 'http://localhost:3000'
    }
  },
  image: {
    imagekit: {
      baseURL: "https://ik.imagekit.io/ljbp46pqv/"
    },
    domains: ['lh3.googleusercontent.com'],
    // Tailwind responsive breakpoints
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  }
});
