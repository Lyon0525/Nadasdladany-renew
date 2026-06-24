import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    build: {
        outDir: '../wwwroot',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:7284',
                secure: false
            }
        }
    }
})