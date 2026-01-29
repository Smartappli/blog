<template>
  <div class="task-list">
    <task-item
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @update="$emit('update', $event)"
      @delete="$emit('delete', $event)"
    />
    <div v-if="tasks.length === 0" class="empty-state">
      <p>📭 No tasks yet. Create your first task!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import TaskItem from './TaskItem.vue';

  defineProps<{
    tasks: any[];
  }>();

  defineEmits<{
    update: [task: any];
    delete: [taskId: string];
  }>();
</script>

<style scoped>
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .empty-state {
    background: white;
    padding: 3rem;
    border-radius: 8px;
    text-align: center;
    color: #999;
  }

  .empty-state p {
    font-size: 1.125rem;
  }
</style>
