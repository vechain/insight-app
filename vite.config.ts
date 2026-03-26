import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import legacy from '@vitejs/plugin-legacy'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { VitePWA } from 'vite-plugin-pwa'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig({
    base: './',
    plugins: [
        // Redirect thor-devkit's internal abi.js to our shim (uses @ethersproject/abi
        // v5 — pure-JS BigNumber, no native BigInt) instead of ethers v6.
        {
            name: 'replace-thor-devkit-abi',
            resolveId(id: string, importer?: string) {
                if (
                    (id === './abi' || id === './abi.js') &&
                    importer?.includes('thor-devkit/esm/')
                ) {
                    return path.resolve(__dirname, 'src/shims/thor-devkit-abi.ts')
                }
            },
        },
        legacy({
            targets: ['chrome >= 66', 'not dead'],
        }),
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
            // picasso's esm/index.js incorrectly uses require() — force CJS entry
            '@vechain/picasso': path.resolve(__dirname, 'node_modules/@vechain/picasso/dist/index.js'),
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.BASE_URL': JSON.stringify('/'),
        'process.env.VUE_APP_IS_DOCKER': JSON.stringify(process.env.VUE_APP_IS_DOCKER || ''),
        'process.env.VUE_APP_SOLO_URL': JSON.stringify(process.env.VUE_APP_SOLO_URL || ''),
        // Chrome 66 doesn't have globalThis (added in Chrome 71); window is equivalent in browsers
        'globalThis': 'window',
    },
})
