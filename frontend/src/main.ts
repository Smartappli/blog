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
    name: 'Revue VuePress',
    version: '2.0.0',
    author: 'Elevéo',
    description: 'Bilingual editorial hub powered by VuePress'
  },

  rootComponent: App,

  createRouter: (config: WalleSmartConfig) => {
    return createRouter({
      history: createWebHistory(config?.basePath || '/'),
      routes: [
        {
          path: '/',
          component: () => import('./views/Home.vue'),
          meta: { title: 'Accueil' }
        },
        {
          path: '/editorial',
          component: () => import('./views/Editorial.vue'),
          meta: { title: 'Éditorial', requiresAuth: true }
        },
        {
          path: '/archive',
          component: () => import('./views/Archive.vue'),
          meta: { title: 'Archives PDF', requiresAuth: true }
        },
        {
          path: '/chatbot',
          component: () => import('./views/Chatbot.vue'),
          meta: { title: 'Chatbot', requiresAuth: true }
        }
      ]
    });
  },

  createPinia: () => createPinia(),

  lifecycle: {
    onMount: () => {
      console.log('✅ Revue VuePress mounted');
    },
    onUnmount: () => {
      console.log('🧹 Revue VuePress unmounted');
    },
    onActivate: () => {
      console.log('👁️ Revue VuePress activated');
    },
    onDeactivate: () => {
      console.log('💤 Revue VuePress deactivated');
    },
    onConfigChange: (config: WalleSmartConfig) => {
      console.log('⚙️ Config changed:', config.theme);
    }
  },

  setup: async (_app: VueApp, _context: PluginContext) => {
    console.log('🔧 Setting up VuePress Blog');
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
      profileName: 'Claire Rédactrice',
      profileRole: 'éditeur',
      appName: 'Revue VuePress',
      csrfToken: 'dev-token'
    });
  }

  sdk.setConfig({
    theme: 'light',
    lang: 'fr',
    basePath: '/'
  });

  const el = document.getElementById('app-root');
  if (!el) throw new Error('Mount point #app-root not found');

  const pluginManager = sdk.getPluginManager();
  await pluginManager.register('blog', plugin, el);

  console.log('✅ Revue VuePress running in standalone mode');
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
