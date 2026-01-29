import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'WesAppBlog', // Global variable name: window.WesAppBlog
      fileName: () => 'wes-app-blog.js',
      formats: ['umd']
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-i18n',
        'vue-router',
        'naive-ui',
        'pinia',
        'echarts',
        '@wallesmart/sdk-vue'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-i18n': 'VueI18n',
          'vue-router': 'VueRouter',
          pinia: 'Pinia',
          'naive-ui': 'NaiveUI',
          echarts: 'Echarts',
          '@wallesmart/sdk-vue': 'WalleSmartSDKVue'
        },
        assetFileNames: 'wes-app-blog.[ext]'
      }
    },
    sourcemap: true
  }
});
