// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
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
  }
});
