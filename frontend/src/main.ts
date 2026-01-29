import { App as VueApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { createVuePlugin, createWalleSmartSDK } from '@wallesmart/sdk-vue';
import type { WalleSmartConfig, PluginContext } from '@wallesmart/sdk-vue';
import App from './App.vue';

// ============================================================================
// Plugin Mode - Installed by WALLeSmart
// ============================================================================
const plugin = createVuePlugin({
  metadata: {
    id: 'blog',
    name: 'Blog',
    version: '1.0.0',
    author: 'Elevéo',
    description: 'Manage farm tasks efficiently'
  },

  rootComponent: App,

  createRouter: (config: WalleSmartConfig) => {
    return createRouter({
      history: createWebHistory(config?.basePath || '/'),
      routes: [
        {
          path: '/',
          component: () => import('./views/Home.vue'),
          meta: { title: 'Home' }
        },
        {
          path: '/tasks',
          component: () => import('./views/Tasks.vue'),
          meta: { title: 'Tasks', requiresAuth: true }
        },
        {
          path: '/profile',
          component: () => import('./views/Profile.vue'),
          meta: { title: 'Profile', requiresAuth: true }
        }
      ]
    });
  },

  createPinia: () => createPinia(),

  lifecycle: {
    onMount: () => {
      console.log('✅ Blog mounted');
    },
    onUnmount: () => {
      console.log('🧹 Blog unmounted');
    },
    onActivate: () => {
      console.log('👁️ Blog activated');
    },
    onDeactivate: () => {
      console.log('💤 Blog deactivated');
    },
    onConfigChange: (config: WalleSmartConfig) => {
      console.log('⚙️ Config changed:', config.theme);
    }
  },

  setup: async (_app: VueApp, _context: PluginContext) => {
    // Any custom setup logic
    console.log('🔧 Setting up Task Management');
  }
});

// ============================================================================
// Standalone Mode - Local Development
// ============================================================================
async function initStandalone() {
  const sdk = createWalleSmartSDK(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

  try {
    await sdk.initialize();
    console.log('✅ SDK initialized');
  } catch (_error) {
    console.warn('⚠️ Backend not available, using fallback config');
    sdk.setConfig({
      profileId: 'dev-profile',
      userId: 'dev-user',
      appId: 'blog',
      memberReferenceId: 'dev-member',
      profileName: 'John Farmer',
      profileRole: 'farmer',
      appName: 'Blog',
      csrfToken: 'dev-token'
    });
  }

  sdk.setConfig({
    theme: 'light',
    lang: 'en',
    basePath: '/'
  });

  const el = document.getElementById('app-root');
  if (!el) throw new Error('Mount point #app-root not found');

  const pluginManager = sdk.getPluginManager();
  await pluginManager.register('blog', plugin, el);

  console.log('✅ Blog running in standalone mode');
}

if (
  import.meta.env.VITE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  document.getElementById('app-root')
) {
  initStandalone();
}

// Export for host app integration
export default plugin;
