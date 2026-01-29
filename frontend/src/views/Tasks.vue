<template>
  <div class="tasks">
    <div class="tasks-header">
      <h2>My Tasks</h2>
      <button @click="showAddTask = true" class="btn btn-primary">➕ Add Task</button>
    </div>

    <div v-if="loading" class="loading">Loading tasks...</div>

    <div v-else-if="error" class="error">
      ❌
      {{
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as any).message
          : error
      }}
    </div>

    <task-list v-else :tasks="tasks" @update="updateTask" @delete="deleteTask" />

    <!-- Add Task Modal -->
    <div v-if="showAddTask" class="modal" @click.self="showAddTask = false">
      <div class="modal-content">
        <h3>Add New Task</h3>
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="Task title..."
          @keyup.enter="addTask"
        />
        <div class="modal-actions">
          <button @click="addTask" class="btn btn-primary">Add</button>
          <button @click="showAddTask = false" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useWalleSmartApi } from '@wallesmart/sdk-vue';
  import TaskList from '@/components/TaskList.vue';

  const api = useWalleSmartApi();

  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<unknown | null>(null);
  const showAddTask = ref(false);
  const newTaskTitle = ref('');

  interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
  }

  interface TasksResponse {
    tasks: Task[];
  }

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/api/tasks');
      const data = response.data as TasksResponse;
      tasks.value = data.tasks;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function addTask() {
    if (!newTaskTitle.value.trim()) return;

    try {
      await api.post('/api/tasks', { title: newTaskTitle.value });
      newTaskTitle.value = '';
      showAddTask.value = false;
      await fetchTasks();
    } catch (e) {
      console.error('Failed to add task:', e);
    }
  }

  async function updateTask(task: Task) {
    try {
      await api.put(`/api/tasks/${task.id}`, task);
      await fetchTasks();
    } catch (e) {
      console.error('Failed to update task:', e);
    }
  }

  async function deleteTask(taskId: Task['id']) {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      await fetchTasks();
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  }

  onMounted(fetchTasks);
</script>

<style scoped>
  .tasks {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-content input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  .modal-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
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
