<template>
  <DashboardLayout>
    <div class="accounts-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ $t('accounts.title') }}</h1>
          <p>{{ $t('accounts.manageAccountsDesc') }}</p>
        </div>
        <div class="page-header-actions">
          <button class="secondary-btn mr-2" @click="refreshAccounts">
            <i class="fas fa-sync-alt"></i>
            <span>{{ $t('dashboard.refresh') }}</span>
          </button>
          <button class="primary-btn" @click="openCreateAccountModal">
            <i class="fas fa-plus"></i>
            <span>{{ $t('accounts.createNewAccount') }}</span>
          </button>
        </div>
      </div>
      
      <!-- Statistics Cards -->
      <div class="accounts-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <div class="stat-info">
            <h3>{{ $t('accounts.totalAccounts') }}</h3>
            <p class="stat-value">{{ stats.totalAccounts }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ $t('accounts.activeAccounts') }}</h3>
            <p class="stat-value">{{ stats.activeAccounts }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-times-circle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ $t('accounts.inactiveAccounts') }}</h3>
            <p class="stat-value">{{ stats.inactiveAccounts }}</p>
          </div>
        </div>
      </div>
      
      <!-- Accounts List -->
      <div class="accounts-list-container">
        <div class="accounts-list-header">
          <h2>{{ $t('accounts.title') }}</h2>
          <div class="accounts-list-actions">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                :placeholder="$t('common.search')"
                @input="filterAccounts"
              >
            </div>
            
            <div class="filter-buttons">
              <span>{{ $t('common.filter') }}:</span>
              <button 
                class="filter-btn" 
                :class="{ 'active': activeFilter === 'all' }"
                @click="setFilter('all')"
              >
                {{ $t('accounts.allAccounts') }}
              </button>
              <button 
                class="filter-btn" 
                :class="{ 'active': activeFilter === 'active' }"
                @click="setFilter('active')"
              >
                {{ $t('accounts.activeAccounts') }}
              </button>
              <button 
                class="filter-btn" 
                :class="{ 'active': activeFilter === 'inactive' }"
                @click="setFilter('inactive')"
              >
                {{ $t('accounts.inactiveAccounts') }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="accounts-table-container">
          <table class="accounts-table">
            <thead>
              <tr>
                <th>{{ $t('accounts.name') }}</th>
                <th>{{ $t('accounts.phoneNumber') }}</th>
                <th class="text-center">{{ $t('accounts.status') }}</th>
                <th>{{ $t('accounts.lastActivity') }}</th>
                <th class="text-center">{{ $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-4">
                  <div class="loading-spinner"></div>
                  <p>{{ $t('common.loading') }}</p>
                </td>
              </tr>
              
              <tr v-else-if="filteredAccounts.length === 0">
                <td colspan="5" class="text-center py-4">
                  {{ $t('accounts.noAccountsFound') }}
                </td>
              </tr>
              
              <tr v-for="account in filteredAccounts" :key="account.id">
                <td class="name-cell" :data-label="$t('accounts.name')">
                  <div class="account-avatar" 
                       :class="[account.isActive ? 'active' : 'inactive', account.profileImage ? 'has-image' : '']"
                       :style="account.profileImage ? `background-image: url(${account.profileImage})` : ''">
                    <span class="initials">{{ account.name.charAt(0) }}</span>
                    <img v-if="account.profileImage" :src="account.profileImage" :alt="account.name" />
                  </div>
                  <span class="account-name">{{ account.name }}</span>
                </td>
                <td :data-label="$t('accounts.phoneNumber')">{{ account.phoneNumber }}</td>
                <td :data-label="$t('accounts.status')">
                  <div class="status-badge-container">
                    <div class="status-badge" :class="account.isActive ? 'connected' : 'disconnected'">
                      <i :class="account.isActive ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                      {{ account.isActive ? $t('accounts.connected') : $t('accounts.disconnected') }}
                    </div>
                  </div>
                </td>
                <td :data-label="$t('accounts.lastActivity')">{{ account.lastActivity }}</td>
                <td :data-label="$t('common.actions')">
                  <div class="actions-container">
                    <button class="action-icon-btn" @click="viewAccount(account)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-icon-btn info-btn" @click="messageWithAccount(account)">
                      <i class="fas fa-paper-plane"></i>
                    </button>
                    <button class="action-icon-btn delete-btn" @click="confirmDeleteAccount(account)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty state when no accounts -->
        <div v-if="accounts.length === 0 && !loading" class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h3>{{ $t('accounts.noAccountsFound') }}</h3>
          <p>{{ $t('accounts.createYourFirstAccount') }}</p>
          <button class="primary-btn" @click="openCreateAccountModal">
            <i class="fas fa-plus"></i>
            <span>{{ $t('accounts.createNewAccount') }}</span>
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const router = useRouter()

// Demo data for accounts
interface Account {
  id: number
  name: string
  phoneNumber: string
  isActive: boolean
  lastActivity: string
  profileImage?: string
}

const loading = ref(true)
const accounts = ref<Account[]>([
  {
    id: 1,
    name: 'Business Account',
    phoneNumber: '+201234567890',
    isActive: true,
    lastActivity: '2 hours ago',
    profileImage: 'https://i.pravatar.cc/150?u=business@example.com'
  },
  {
    id: 2,
    name: 'Personal Account',
    phoneNumber: '+201987654321',
    isActive: false,
    lastActivity: '1 day ago'
  },
  {
    id: 3,
    name: 'Marketing Account',
    phoneNumber: '+201122334455',
    isActive: true,
    lastActivity: '3 hours ago',
    profileImage: 'https://i.pravatar.cc/150?u=marketing@example.com'
  }
])

// Filtering and search
const searchQuery = ref('')
const activeFilter = ref('all')

const stats = computed(() => {
  const totalAccounts = accounts.value.length
  const activeAccounts = accounts.value.filter(account => account.isActive).length
  const inactiveAccounts = totalAccounts - activeAccounts
  
  return {
    totalAccounts,
    activeAccounts,
    inactiveAccounts
  }
})

const filteredAccounts = computed(() => {
  return accounts.value.filter(account => {
    // Apply search filter
    const matchesSearch = searchQuery.value === '' || 
      account.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      account.phoneNumber.includes(searchQuery.value)
    
    // Apply active/inactive filter
    const matchesStatus = 
      activeFilter.value === 'all' || 
      (activeFilter.value === 'active' && account.isActive) ||
      (activeFilter.value === 'inactive' && !account.isActive)
    
    return matchesSearch && matchesStatus
  })
})

// Methods
const filterAccounts = () => {
  // This function is triggered when the search query changes
  // The filtering itself is handled by the computed property
}

const setFilter = (filter: string) => {
  activeFilter.value = filter
}

const refreshAccounts = () => {
  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const viewAccount = (account: Account) => {
  router.push(`/accounts/${account.id}`)
}

const messageWithAccount = (account: Account) => {
  router.push({
    path: '/send-message',
    query: { account: account.id.toString() }
  })
}

const confirmDeleteAccount = (account: Account) => {
  if (confirm(`Are you sure you want to delete ${account.name}?`)) {
    // Delete the account
    accounts.value = accounts.value.filter(a => a.id !== account.id)
  }
}

const openCreateAccountModal = () => {
  alert('Open create account modal - to be implemented')
}

// Load accounts on mount
onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.accounts-page {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
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

.page-header-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* Account Stats */
.accounts-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.stat-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: var(--spacing-5);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, var(--color-primary), var(--color-primary-dark));
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(html[dir="rtl"]) .stat-card::before {
  background: linear-gradient(to left, var(--color-primary), var(--color-primary-dark));
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-4);
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

:deep(html[dir="rtl"]) .stat-icon {
  margin-right: 0;
  margin-left: var(--spacing-4);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
  background-color: var(--color-primary);
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: var(--spacing-1);
  color: var(--text-muted);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.2;
  margin: 0;
}

/* RTL improvements for stat cards */
:deep(html[dir="rtl"]) .stat-card {
  flex-direction: row-reverse;
  text-align: right;
}

.accounts-list-container {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: var(--spacing-4);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: var(--spacing-4);
  border: 1px solid var(--border-color);
  animation: slideUp 0.5s ease-in-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.accounts-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.accounts-list-header h2 {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.accounts-list-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

/* Enhanced search box */
.search-box {
  position: relative;
  min-width: 200px;
}

.search-box i {
  position: absolute;
  left: var(--spacing-2);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.9rem;
  pointer-events: none;
  transition: color 0.3s ease;
}

:deep(html[dir="rtl"]) .search-box i {
  left: auto;
  right: var(--spacing-2);
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 32px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

:deep(html[dir="rtl"]) .search-box input {
  padding: 10px 32px 10px 10px;
}

.search-box input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
}

.search-box input:focus + i {
  color: var(--color-primary);
}

/* Filter buttons */
.filter-buttons {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.filter-buttons span {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-right: var(--spacing-1);
}

:deep(html[dir="rtl"]) .filter-buttons span {
  margin-right: 0;
  margin-left: var(--spacing-1);
}

.filter-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: 0.85rem;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background-color: rgba(var(--color-primary-rgb), 0.05);
  border-color: var(--color-primary);
}

.filter-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(var(--color-primary-rgb), 0.2);
}

/* Accounts Table */
.accounts-table-container {
  /* Table container styling has been moved to shared component CSS */
  /* See src/assets/styles/components/accounts-table.css */
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  margin: 2rem auto;
  max-width: 500px;
  text-align: center;
  background-color: var(--hover-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px dashed var(--border-color);
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  background-color: rgba(var(--color-primary-rgb), 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-size: 2rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .accounts-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .accounts-stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-3);
  }
  
  .stat-card {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .page-header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .accounts-list-container {
    background-color: transparent;
    box-shadow: none;
    border: none;
    padding: var(--spacing-2);
  }
  
  .accounts-list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-3);
    background-color: var(--card-bg);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: var(--spacing-3);
  }
  
  .accounts-list-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-2);
  }
  
  .search-box {
    width: 100%;
    margin-bottom: var(--spacing-2);
  }
  
  .filter-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: var(--spacing-1);
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    white-space: nowrap;
  }
  
  .filter-buttons::-webkit-scrollbar {
    display: none;
  }
  
  .filter-btn {
    flex-shrink: 0;
  }
}

@media (max-width: 576px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: var(--spacing-3);
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .accounts-table th,
  .accounts-table td {
    padding: 10px;
    font-size: 0.85rem;
  }
}
</style> 