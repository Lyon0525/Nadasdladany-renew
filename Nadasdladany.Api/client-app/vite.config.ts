import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- EZ HIÁNYZOTT

export default defineConfig({
    plugins: [
        react(),
        tailwindcss() // <--- EZ IS KELLETT
    ],
    build: {
        outDir: '../wwwroot',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:7001',
                secure: false
            }
        }
    }
})