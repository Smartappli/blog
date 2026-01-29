<template>
  <div class="home">
    <h2>Welcome to Blog! 👋</h2>
    <p
      >Hello, <strong>{{ config.profileName }}</strong
      >!</p
    >

    <div class="stats">
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedTasks }}</div>
          <div class="stat-label">Completed Tasks</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingTasks }}</div>
          <div class="stat-label">Pending Tasks</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalTasks }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <router-link to="/tasks" class="btn btn-primary">View All Tasks</router-link>
      <router-link to="/profile" class="btn btn-secondary">My Profile</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useWalleSmartConfig, useWalleSmartApi } from '@wallesmart/sdk-vue';

  const config = useWalleSmartConfig();
  const api = useWalleSmartApi();

  const stats = ref({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  onMounted(async () => {
    try {
      const response = await api.get('/api/tasks');
      const data = response.data as { tasks: Array<{ completed: boolean }> };
      const tasks = data.tasks;
      stats.value = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.completed).length,
        pendingTasks: tasks.filter((t) => !t.completed).length
      };
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  });
</script>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 2.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #666;
  }

  .quick-actions {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .quick-actions h3 {
    margin-bottom: 0.5rem;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    text-align: center;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #3498db;
    color: white;
  }

  .btn-primary:hover {
    background: #2980b9;
  }

  .btn-secondary {
    background: #95a5a6;
    color: white;
  }

  .btn-secondary:hover {
    background: #7f8c8d;
  }
</style>
