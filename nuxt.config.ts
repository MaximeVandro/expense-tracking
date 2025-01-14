// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  plugins: ['~/plugins/element-plus.js'],
  css: ['@/assets/styles/global.css'],
  nitro: {
    preset: 'node-server',
  },
})
