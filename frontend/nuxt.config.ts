import { resolve } from "path";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-12",
  srcDir: "src/",
  css: [
    "@/styles/globals.scss",
    "@/styles/utils.scss",
    "@/styles/components.scss",
  ],
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  imports: {
    dirs: ["composables/*.ts", "composables/**/*.ts"],
  },
  // alias: {
  //   "@": resolve(__dirname, "./src"),
  // },
  shadcn: {
    // prefix: "Shad",
    prefix: "",
    componentDir: "@/components/ui",
  },
  components: [
    {
      extensions: [".vue"],
      path: "@/components",
    },
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.FRONTEND_API_URL,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },
});
