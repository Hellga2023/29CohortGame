import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { VitePWA } from 'vite-plugin-pwa';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: Number(process.env.CLIENT_PORT) || 3000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@common': path.resolve(__dirname, './src/components/common'),
            '@game': path.resolve(__dirname, './src/game'),
        },
    },
    define: {
        __SERVER_PORT__: process.env.SERVER_PORT,
    },
    plugins: [
        react(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src/utils/ServiceWorker',
            filename: 'serviceWorker.js',
            outDir: 'dist',
            devOptions: {
                enabled: true,
            },
            injectManifest: {
                globPatterns: ['***.{ts,js,css,tsx,scss,woff2,png,svg,jpg,js}'],
            },
            workbox: {},
            manifest: {
                name: "Re4m's game",
                short_name: 'r4 Game',
                description: "Re4m's game for praktikum",
                theme_color: '#ffffff',
            },
        }),
    ],
});
