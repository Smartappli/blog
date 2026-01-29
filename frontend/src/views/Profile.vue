<template>
  <div class="profile">
    <h2>My Profile</h2>

    <div class="profile-card">
      <div class="profile-avatar">{{ profile.avatar }}</div>

      <div class="profile-info">
        <div class="info-row">
          <label>Name:</label>
          <span>{{ profile.name }}</span>
        </div>

        <div class="info-row">
          <label>Role:</label>
          <span class="badge">{{ profile.role }}</span>
        </div>

        <div class="info-row">
          <label>Email:</label>
          <span>{{ profile.email }}</span>
        </div>

        <div class="info-row">
          <label>Profile ID:</label>
          <code>{{ profile.id }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useWalleSmartApi } from '@wallesmart/sdk-vue';

  const api = useWalleSmartApi();

  const profile = ref({
    id: '',
    name: '',
    role: '',
    email: '',
    avatar: '👤'
  });

  onMounted(async () => {
    try {
      const response = await api.get('/api/user/profile');
      profile.value = response.data as typeof profile.value;
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  });
</script>

<style scoped>
  .profile {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .profile-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 2rem;
  }

  .profile-avatar {
    font-size: 5rem;
  }

  .profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .info-row label {
    font-weight: 600;
    min-width: 100px;
  }

  .badge {
    background: #e0e0e0;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    text-transform: uppercase;
  }

  code {
    background: #f5f5f5;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }
</style>
