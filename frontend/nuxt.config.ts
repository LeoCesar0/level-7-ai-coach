import { resolve } from "path";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-12",
  srcDir: "src/",
  ssr: false,
  css: [
    "@/styles/globals.scss",
    "@/styles/utils.scss",
    "@/styles/components.scss",
  ],
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt"],
  imports: {
    dirs: ["composables/*.ts", "composables/**/*.ts"],
  },
  typescript: {
    typeCheck: true
  },
  alias: {
    // "@": resolve(__dirname, "./src"),
    // '@common/*':resolve(__dirname, "./../common/*"),
    // "@common/*": "./../common/*",
    // "@common": resolve(__dirname, "./common"),
    "@common": resolve(__dirname, "./../common"),
    "@lib": resolve(__dirname, "./src/lib"),
    "@helpers": resolve(__dirname, "./src/helpers"),
    "@components": resolve(__dirname, "./src/components"),
    "@static": resolve(__dirname, "./src/static"),
  },
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
