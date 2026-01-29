import { App as VueApp } from 'vue';
import { createVuePlugin, createWalleSmartSDK } from '@wallesmart/sdk-vue';
import type { WalleSmartConfig, PluginContext } from '@wallesmart/sdk-vue';
import BlogWidget from './BlogWidget.vue';

// ============================================================================
// Plugin Mode - Installed by WALLeSmart
// ============================================================================
const plugin = createVuePlugin({
  metadata: {
    id: 'blog-widget',
    name: 'Blog Widget',
    version: '1.0.0',
    author: 'Elevéo',
    description: 'Consultation on Walloon livestock farming'
  },

  rootComponent: BlogWidget,

  lifecycle: {
    onMount: () => {
      console.log('✅ Blog Widget mounted');
    },
    onUnmount: () => {
      console.log('🧹 Blog Widget unmounted');
    },
    onActivate: () => {
      console.log('👁️ Blog Widget activated');
    },
    onDeactivate: () => {
      console.log('💤 Blog Widget deactivated');
    },
    onConfigChange: (config: WalleSmartConfig) => {
      console.log('⚙️ Config changed:', config.theme);
    }
  },

  setup: async (_app: VueApp, _context: PluginContext) => {
    // Any custom setup logic
    console.log('🔧 Setting up Blog Widget');
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
      appId: 'blog-widget',
      memberReferenceId: 'dev-member',
      profileName: 'John Farmer',
      profileRole: 'farmer',
      appName: 'Blog Widget',
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
  await pluginManager.register('blog-widget', plugin, el);

  console.log('✅ Blog Widget running in standalone mode');
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
