<template>
  <DashboardLayout>
    <div class="dashboard-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ $t('dashboard.title') }}</h1>
          <p>{{ $t('dashboard.welcomeBack') }} {{ userName }}</p>
        </div>
        <div class="page-header-actions">
          <button class="secondary-btn mr-2" @click="refreshDashboard">
            <i class="fas fa-sync-alt"></i>
            <span>{{ $t('dashboard.refresh') }}</span>
          </button>
        </div>
      </div>
      
      <!-- Statistics Cards -->
      <div class="stats-grid">
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
            <i class="fas fa-paper-plane"></i>
          </div>
          <div class="stat-info">
            <h3>{{ $t('messages.sentMessages') }}</h3>
            <p class="stat-value">{{ stats.totalMessages }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3>{{ $t('contacts.totalContacts') }}</h3>
            <p class="stat-value">{{ stats.totalContacts }}</p>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity and Quick Actions -->
      <div class="dashboard-sections">
        <!-- Recent Activity -->
        <div class="dashboard-section activity-section">
          <div class="section-header">
            <h2>{{ $t('dashboard.recentActivity') }}</h2>
            <button class="secondary-btn sm">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>
          
          <div class="activity-list">
            <div v-if="recentActivity.length === 0" class="empty-activity">
              <i class="fas fa-history"></i>
              <p>{{ $t('dashboard.noRecentActivity') }}</p>
            </div>
            
            <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <p class="activity-message">{{ activity.message }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="dashboard-section quick-actions-section">
          <div class="section-header">
            <h2>{{ $t('dashboard.quickActions') }}</h2>
          </div>
          
          <div class="quick-actions-grid">
            <router-link to="/accounts" class="quick-action">
              <div class="quick-action-icon">
                <i class="fas fa-mobile-alt"></i>
              </div>
              <h3>{{ $t('accounts.manageAccounts') }}</h3>
              <p>{{ $t('accounts.manageAccountsDesc') }}</p>
            </router-link>
            
            <router-link to="/send-message" class="quick-action">
              <div class="quick-action-icon">
                <i class="fas fa-paper-plane"></i>
              </div>
              <h3>{{ $t('messages.sendMessage') }}</h3>
              <p>{{ $t('messages.sendMessageDesc') }}</p>
            </router-link>
            
            <router-link to="/contacts" class="quick-action">
              <div class="quick-action-icon">
                <i class="fas fa-address-book"></i>
              </div>
              <h3>{{ $t('contacts.manageContacts') }}</h3>
              <p>{{ $t('contacts.manageContactsDesc') }}</p>
            </router-link>
            
            <router-link to="/settings" class="quick-action">
              <div class="quick-action-icon">
                <i class="fas fa-cog"></i>
              </div>
              <h3>{{ $t('settings.title') }}</h3>
              <p>{{ $t('settings.desc') }}</p>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Recent Accounts Section -->
      <div class="dashboard-section accounts-section">
        <div class="section-header">
          <h2>{{ $t('accounts.recentAccounts') }}</h2>
          <router-link to="/accounts" class="view-all-link">
            {{ $t('common.viewAll') }} <i class="fas fa-chevron-right"></i>
          </router-link>
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
              <tr v-if="recentAccounts.length === 0">
                <td colspan="5" class="text-center py-4">
                  {{ $t('accounts.noAccountsFound') }}
                </td>
              </tr>
              
              <tr v-for="account in recentAccounts" :key="account.id">
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
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

// User information
const userName = computed(() => {
  return authStore.user?.name || authStore.user?.username || 'User'
})

// Dashboard stats
const stats = ref({
  totalAccounts: 0,
  activeAccounts: 0,
  totalMessages: 0,
  totalContacts: 0
})

// Recent activity
type ActivityType = 'message' | 'account' | 'contact' | 'system'
interface Activity {
  type: ActivityType
  message: string
  time: string
}

const recentActivity = ref<Activity[]>([
  {
    type: 'message',
    message: 'You sent a bulk message to 50 contacts',
    time: '2 hours ago'
  },
  {
    type: 'account',
    message: 'New WhatsApp account connected',
    time: '5 hours ago'
  },
  {
    type: 'system',
    message: 'System update completed successfully',
    time: '1 day ago'
  },
  {
    type: 'contact',
    message: 'Imported 120 contacts from CSV file',
    time: '2 days ago'
  }
])

// Recent accounts
interface Account {
  id: number
  name: string
  phoneNumber: string
  isActive: boolean
  lastActivity: string
  profileImage?: string
}

const recentAccounts = ref<Account[]>([
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

// Get activity icon based on type
const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'message':
      return 'fas fa-paper-plane'
    case 'account':
      return 'fas fa-mobile-alt'
    case 'contact':
      return 'fas fa-address-book'
    case 'system':
      return 'fas fa-cog'
    default:
      return 'fas fa-info-circle'
  }
}

// Action handlers
const refreshDashboard = () => {
  // Here you would fetch the latest dashboard data
  stats.value = {
    totalAccounts: 3,
    activeAccounts: 2,
    totalMessages: 1250,
    totalContacts: 385
  }
}

const viewAccount = (account: Account) => {
  router.push(`/accounts/${account.id}`)
}

const messageWithAccount = (account: Account) => {
  router.push({
    path: '/send-message',
    query: { account: account.id }
  })
}

// Load dashboard data on component mount
onMounted(() => {
  refreshDashboard()
})
</script>

<style scoped>
.dashboard-page {
  animation: fade-slide-up 0.6s ease-out;
}

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  padding-top: 13px;
}

.page-header-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* Stats Grid */
.stats-grid {
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
  animation: scale-in 0.5s ease-out;
  animation-fill-mode: both;
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

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}

.stat-card:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Dashboard Sections Layout */
.dashboard-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.dashboard-section {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
  animation: slide-in 0.5s ease-out;
  animation-fill-mode: both;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.view-all-link {
  display: flex;
  align-items: center;
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.view-all-link i {
  margin-left: var(--spacing-1);
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

:deep(html[dir="rtl"]) .view-all-link i {
  margin-left: 0;
  margin-right: var(--spacing-1);
  transform: rotate(180deg);
}

.view-all-link:hover {
  color: var(--color-primary-dark);
}

.view-all-link:hover i {
  transform: translateX(3px);
}

:deep(html[dir="rtl"]) .view-all-link:hover i {
  transform: translateX(-3px) rotate(180deg);
}

/* Activity Section */
.activity-list {
  padding: var(--spacing-2);
  height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background-color: var(--hover-bg);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-3);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

:deep(html[dir="rtl"]) .activity-icon {
  margin-right: 0;
  margin-left: var(--spacing-3);
}

.activity-icon.message {
  background-color: rgba(52, 183, 241, 0.1);
  color: #34B7F1;
}

.activity-icon.account {
  background-color: rgba(37, 211, 102, 0.1);
  color: var(--color-primary);
}

.activity-icon.contact {
  background-color: rgba(255, 193, 7, 0.1);
  color: var(--color-warning);
}

.activity-icon.system {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.activity-item:hover .activity-icon {
  transform: scale(1.1);
}

.activity-content {
  flex: 1;
}

.activity-message {
  margin: 0 0 var(--spacing-1) 0;
  font-size: 0.9rem;
  color: var(--text-color);
}

.activity-time {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.empty-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  padding: var(--spacing-6);
  text-align: center;
}

.empty-activity i {
  font-size: 2rem;
  margin-bottom: var(--spacing-4);
  opacity: 0.5;
}

/* Quick Actions */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-3);
  padding: var(--spacing-4);
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-3);
  border-radius: var(--border-radius);
  color: var(--text-color);
  transition: all 0.3s ease;
  text-decoration: none;
  border: 1px solid var(--border-color);
}

.quick-action:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.quick-action-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-2);
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.quick-action:hover .quick-action-icon {
  background-color: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.quick-action h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-1) 0;
  transition: color 0.3s ease;
}

.quick-action p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  display: none;
}

.quick-action:hover h3 {
  color: var(--color-primary);
}

/* Recent Accounts Section */
.accounts-section {
  margin-bottom: var(--spacing-6);
}

/* Accounts table styling has been moved to shared CSS file */
/* src/assets/styles/components/accounts-table.css */

/* Responsive adjustments */
@media (max-width: 992px) {
  .dashboard-sections {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .activity-section, .quick-actions-section {
    height: auto;
  }

  .activity-list {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
    padding-bottom: var(--spacing-3);
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .page-header p {
    font-size: 0.85rem;
  }

  .page-header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .dashboard-sections {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }

  .activity-section, .quick-actions-section {
    height: auto;
  }

  .activity-list {
    height: 250px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-3);
  }

  .quick-action p {
    display: block;
    max-height: 40px;
    overflow: hidden;
    font-size: 0.75rem;
  }
  
  .quick-action h3 {
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .quick-action-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-2);
  }

  .stat-card {
    padding: var(--spacing-2);
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    margin-right: var(--spacing-2);
  }
  
  :deep(html[dir="rtl"]) .stat-icon {
    margin-right: 0;
    margin-left: var(--spacing-2);
  }

  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-info h3 {
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .section-header {
    padding: var(--spacing-3);
  }
  
  .section-header h2 {
    font-size: 1rem;
  }

  .activity-list {
    height: 220px;
  }
}

.activity-section {
  animation-delay: 0.3s;
}

.quick-actions-section {
  animation-delay: 0.4s;
}

.accounts-section {
  animation: slide-in 0.5s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* RTL Support */
:deep(html[dir="rtl"]) .dashboard-section {
  animation-name: slide-in-rtl;
}

@keyframes slide-in-rtl {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

:deep(html[dir="rtl"]) .account-avatar::before {
  right: auto;
  left: 0;
}

/* Stat card RTL improvements */
:deep(html[dir="rtl"]) .stat-card {
  flex-direction: row-reverse;
  text-align: right;
}
</style> 