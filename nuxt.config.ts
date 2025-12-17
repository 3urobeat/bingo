import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: "2025-09-08",
    css: ["~/pages/main.css"],
    vite: {
        plugins: [
            tailwindcss()
        ],
    },
    modules: ["@nuxtjs/device"],
});
