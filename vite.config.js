import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    publicDir: 'public',
    build: {
        outDir: '../dist',
        minify: false,
        sourcemap: true,
        rollupOptions: {
            output: {
                assetFileNames: `assets/[name].[ext]`
            }
        }
    }
});
