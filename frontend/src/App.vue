<template>
  <div id="app">
    <header class="app-header">
      <div class="brand">
        <img src="./assets/logo_blog2.png" alt="Revue VuePress" />
        <div>
          <h1>{{ t('appName') }}</h1>
          <p>{{ t('vuepressLabel') }}</p>
        </div>
      </div>
      <nav>
        <router-link to="/">{{ t('navHome') }}</router-link>
        <router-link to="/editorial">{{ t('navEditorial') }}</router-link>
        <router-link to="/archive">{{ t('navArchive') }}</router-link>
        <router-link to="/chatbot">{{ t('navChatbot') }}</router-link>
      </nav>
      <div class="header-actions">
        <div class="language-toggle">
          <span>{{ t('languageLabel') }}</span>
          <button
            :class="{ active: language === 'fr' }"
            @click="setLanguage('fr')"
            type="button"
          >
            FR
          </button>
          <button
            :class="{ active: language === 'de' }"
            @click="setLanguage('de')"
            type="button"
          >
            DE
          </button>
        </div>
        <div class="user-info">
          <span>👤 {{ config.profileName }}</span>
          <span class="badge">{{ config.profileRole }}</span>
        </div>
      </div>
    </header>

    <main class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { useWalleSmartConfig } from '@wallesmart/sdk-vue';
  import { provideLocale } from './composables/useLocale';

  const config = useWalleSmartConfig();
  const { language, setLanguage, t } = provideLocale();
</script>

<style>
  :root {
    color-scheme: light;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    background: #f4f6fb;
    color: #1d2330;
  }

  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    background: white;
    padding: 1.25rem 2rem;
    box-shadow: 0 12px 28px rgba(10, 25, 41, 0.08);
    display: flex;
    align-items: center;
    gap: 2rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .brand img {
    width: 56px;
    height: 56px;
    object-fit: contain;
  }

  .brand h1 {
    font-size: 1.35rem;
    font-weight: 700;
  }

  .brand p {
    font-size: 0.85rem;
    color: #64748b;
  }

  .app-header nav {
    display: flex;
    gap: 0.75rem;
    flex: 1;
  }

  .app-header nav a {
    padding: 0.55rem 1rem;
    text-decoration: none;
    color: #4b5563;
    border-radius: 999px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .app-header nav a:hover {
    background: #eef2ff;
    color: #1d4ed8;
  }

  .app-header nav a.router-link-active {
    background: #1d4ed8;
    color: white;
    box-shadow: 0 8px 16px rgba(29, 78, 216, 0.2);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .language-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f1f5f9;
    padding: 0.35rem 0.5rem;
    border-radius: 999px;
    font-size: 0.85rem;
    color: #475569;
  }

  .language-toggle button {
    border: none;
    background: transparent;
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
    color: inherit;
  }

  .language-toggle button.active {
    background: #1d4ed8;
    color: white;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .badge {
    background: #e2e8f0;
    padding: 0.25rem 0.6rem;
    border-radius: 12px;
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #475569;
  }

  .app-content {
    flex: 1;
    padding: 2rem 2.5rem 3rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  @media (max-width: 960px) {
    .app-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .app-header nav {
      flex-wrap: wrap;
    }

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
