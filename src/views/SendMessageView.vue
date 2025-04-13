<template>
  <DashboardLayout>
    <div class="send-message-page">
      <div class="page-header">
        <div>
          <h1>{{ $t('messages.sendMessage') }}</h1>
          <p>{{ $t('messages.sendMessageDesc') }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>{{ $t('messages.messageForm') }}</h2>
        </div>
        <div class="card-body">
          <p>{{ $t('common.placeholder') }}</p>
          <p>{{ $t('common.comingSoon') }}</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const route = useRoute()

// Check if an account was specified
onMounted(() => {
  const accountId = route.query.account
  if (accountId) {
    console.log('Using account ID:', accountId)
  }
})
</script>

<style scoped>
.card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  margin-bottom: var(--spacing-4);
  overflow: hidden;
}

.card-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-color);
  background-color: rgba(var(--color-primary-rgb), 0.03);
}

.card-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: var(--spacing-4);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--border-color);
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: var(--spacing-1);
  color: var(--text-color);
  position: relative;
}

.page-header h1::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  height: 3px;
  width: 40px;
  background-color: var(--color-primary);
  border-radius: 3px;
}

:deep(html[dir="rtl"]) .page-header h1::after {
  left: auto;
  right: 0;
}

.page-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
  max-width: 500px;
}
</style> 