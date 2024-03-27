import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: tag => tag.includes('-'),
                },
            },
        }),
    ],
    build: {
        chunkSizeWarningLimit: 2500,
    },
    base: process.env.VITE_BASE_PATH,
})
