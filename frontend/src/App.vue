<template>
  <div id="app">
    <header class="app-header">
      <img src="./assets/logo_blog2.png" alt="Wallonie Elevages / Wallonie Tierzucht" />
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/tasks">Tasks</router-link>
        <router-link to="/profile">Profile</router-link>
      </nav>
      <div class="user-info">
        <span>👤 {{ config.profileName }}</span>
        <span class="badge">{{ config.profileRole }}</span>
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

  const config = useWalleSmartConfig();
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    background: #f5f5f5;
  }

  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .app-header h1 {
    font-size: 1.5rem;
  }

  .app-header nav {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  .app-header nav a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #666;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .app-header nav a:hover {
    background: #f0f0f0;
    color: #333;
  }

  .app-header nav a.router-link-active {
    background: #3498db;
    color: white;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .badge {
    background: #e0e0e0;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .app-content {
    flex: 1;
    padding: 2rem;
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
</style>
