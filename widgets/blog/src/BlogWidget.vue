<template>
  <div v-if="data" class="blog-widget">
    <div class="widget-header">
      <h3>📊 Blog</h3>
      <button @click="refresh" class="refresh-btn" title="Refresh">🔄</button>
    </div>

    <div class="stats-grid">
      <div class="stat-box total">
        <div class="stat-value">{{ data.total }}</div>
        <div class="stat-label">Total</div>
      </div>

      <div class="stat-box completed">
        <div class="stat-value">{{ data.completed }}</div>
        <div class="stat-label">Completed</div>
      </div>

      <div class="stat-box pending">
        <div class="stat-value">{{ data.pending }}</div>
        <div class="stat-label">Pending</div>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
    </div>

    <div class="recent-tasks">
      <h4>Recent Tasks</h4>
      <div
        v-for="task in data.recentTasks"
        :key="task.id"
        class="task-preview"
        :class="{ completed: task.completed }"
      >
        <span class="task-icon">{{ task.completed ? '✅' : '⏳' }}</span>
        <span class="task-text">{{ task.title }}</span>
      </div>
      <div v-if="data.recentTasks.length === 0" class="no-tasks"> No tasks yet </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useWalleSmartApi } from '@wallesmart/sdk-vue';

  interface BlogData {
    total: number;
    completed: number;
    pending: number;
    recentTasks: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>;
  }

  const api = useWalleSmartApi();
  const data = ref<BlogData | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  async function refresh() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/widgets/blog');
      data.value = response.data as BlogData;
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  const progressPercentage = computed(() => {
    if (!data.value || data.value.total === 0) return 0;
    return Math.round((data.value.completed / data.value.total) * 100);
  });

  refresh();
</script>

<style scoped>
  .blog-widget {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .widget-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }

  .refresh-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.6;
    transition:
      opacity 0.2s,
      transform 0.2s;
  }

  .refresh-btn:hover {
    opacity: 1;
    transform: rotate(90deg);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .stat-box {
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 8px;
    text-align: center;
    border: 2px solid transparent;
  }

  .stat-box.total {
    border-color: #3498db;
  }

  .stat-box.completed {
    border-color: #2ecc71;
  }

  .stat-box.pending {
    border-color: #f39c12;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #666;
    text-transform: uppercase;
    margin-top: 0.25rem;
  }

  .progress-bar {
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    transition: width 0.3s ease;
  }

  .recent-tasks {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .recent-tasks h4 {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
    text-transform: uppercase;
  }

  .task-preview {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .task-preview.completed {
    opacity: 0.6;
  }

  .task-preview.completed .task-text {
    text-decoration: line-through;
  }

  .task-icon {
    font-size: 1rem;
  }

  .task-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .no-tasks {
    text-align: center;
    padding: 1rem;
    color: #999;
    font-size: 0.875rem;
  }
</style>
