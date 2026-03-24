import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { VitePWA } from 'vite-plugin-pwa'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig({
    base: './',
    plugins: [
        nodePolyfills({
            include: ['buffer', 'crypto', 'http', 'https', 'stream', 'process', 'util'],
            globals: {
                Buffer: true,
                process: true,
            },
        }),
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(__dirname, 'src/assets/octicons/svg')],
            symbolId: 'icon-[name]',
        }),
        VitePWA({
            injectRegister: null,
            strategies: 'generateSW',
            filename: 'service-worker.js',
            workbox: {
                skipWaiting: true,
                clientsClaim: true,
            },
            manifest: {
                name: 'VeChain Insight',
                short_name: 'Insight',
                theme_color: '#6c757d',
                background_color: '#f0f0f0',
                display: 'standalone',
                start_url: './',
                icons: [
                    {
                        src: './img/icons/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: './img/icons/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.BASE_URL': JSON.stringify('/'),
        'process.env.VUE_APP_IS_DOCKER': JSON.stringify(process.env.VUE_APP_IS_DOCKER || ''),
        'process.env.VUE_APP_SOLO_URL': JSON.stringify(process.env.VUE_APP_SOLO_URL || ''),
    },
})
