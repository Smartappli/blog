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
      name: 'WesWidgetBlog', // Global variable name: window.WesWidgetBlog
      fileName: () => 'wes-widget-blog.js',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['vue', 'vue-i18n', 'naive-ui', 'echarts', '@wallesmart/sdk-vue'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-i18n': 'VueI18n',
          'naive-ui': 'NaiveUI',
          echarts: 'Echarts',
          '@wallesmart/sdk-vue': 'WalleSmartSDKVue'
        },
        assetFileNames: 'wes-widget-blog.[ext]'
      }
    },
    sourcemap: true
  }
});
