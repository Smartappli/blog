<template>
  <div class="task-item" :class="{ completed: task.completed }">
    <input
      type="checkbox"
      :checked="task.completed"
      @change="toggleComplete"
      class="task-checkbox"
    />

    <div class="task-content">
      <div class="task-title">{{ task.title }}</div>
      <div class="task-meta"> Created {{ formatDate(task.createdAt) }} </div>
    </div>

    <button @click="$emit('delete', task.id)" class="btn-delete" title="Delete task"> 🗑️ </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    task: {
      id: string;
      title: string;
      completed: boolean;
      createdAt: string;
    };
  }>();

  const emit = defineEmits<{
    update: [task: any];
    delete: [taskId: string];
  }>();

  function toggleComplete() {
    emit('update', {
      ...props.task,
      completed: !props.task.completed
    });
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }
</script>

<style scoped>
  .task-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.2s;
  }

  .task-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .task-item.completed {
    opacity: 0.6;
  }

  .task-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .task-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .task-title {
    font-size: 1rem;
    font-weight: 500;
  }

  .task-item.completed .task-title {
    text-decoration: line-through;
    color: #999;
  }

  .task-meta {
    font-size: 0.75rem;
    color: #999;
  }

  .btn-delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .btn-delete:hover {
    opacity: 1;
  }
</style>
