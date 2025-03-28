import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  plugins: ['~/plugins/ApolloClient.ts'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      graphqlEndpoint: process.env.GRAPHQL_ENDPOINT
    }
  }
});
