<template>
  <DashboardLayout>
    <div class="account-details-page">
      <div class="page-header">
        <div>
          <h1>{{ $t('accounts.accountDetails') }}</h1>
          <p>{{ account.name }}</p>
        </div>
        <div class="page-header-actions">
          <button class="secondary-btn mr-2" @click="goBack">
            <i class="fas fa-arrow-left"></i>
            <span>{{ $t('common.back') }}</span>
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>{{ $t('accounts.information') }}</h2>
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
import { useRouter, useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const router = useRouter()
const route = useRoute()

const account = ref({
  id: parseInt(route.params.id as string),
  name: 'Account #' + route.params.id,
  phoneNumber: '+20123456789',
  isActive: true,
  lastActivity: 'Just now'
})

const goBack = () => {
  router.back()
}

onMounted(() => {
  // Load account details
  console.log('Loading account details for ID:', route.params.id)
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