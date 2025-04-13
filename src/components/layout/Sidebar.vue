<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Logo -->
    <div class="logo-container">
      <div class="logo">
        <i class="fab fa-whatsapp"></i>
        <span>{{ $t('common.whatsappSender') }}</span>
      </div>
    </div>
    
    <!-- Main Menu -->
    <div class="sidebar-section">
      <h3>{{ $t('common.mainMenu') }}</h3>
      <ul class="sidebar-menu">
        <li :class="{ 'active': currentRoute === 'dashboard' }">
          <router-link to="/dashboard" :data-title="$t('dashboard.title')">
            <i class="fas fa-tachometer-alt"></i>
            <span>{{ $t('dashboard.title') }}</span>
          </router-link>
        </li>
        <li :class="{ 'active': currentRoute === 'accounts' }">
          <router-link to="/accounts" :data-title="$t('accounts.title')">
            <i class="fas fa-mobile-alt"></i>
            <span>{{ $t('accounts.title') }}</span>
          </router-link>
        </li>
        <li :class="{ 'active': currentRoute === 'send-message' }">
          <router-link to="/send-message" :data-title="$t('messages.sendMessage')">
            <i class="fas fa-paper-plane"></i>
            <span>{{ $t('messages.sendMessage') }}</span>
          </router-link>
        </li>
        <li :class="{ 'active': currentRoute === 'message-log' }">
          <router-link to="/message-log" :data-title="$t('messages.messageLog')">
            <i class="fas fa-history"></i>
            <span>{{ $t('messages.messageLog') }}</span>
          </router-link>
        </li>
        <li :class="{ 'active': currentRoute === 'settings' }">
          <router-link to="/settings" :data-title="$t('settings.title')">
            <i class="fas fa-cog"></i>
            <span>{{ $t('settings.title') }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    
    <!-- Account Section -->
    <div class="sidebar-section">
      <h3>{{ $t('settings.account') }}</h3>
      <ul class="sidebar-menu">
        <li :class="{ 'active': currentRoute === 'profile' }">
          <router-link to="/profile" :data-title="$t('settings.profile')">
            <i class="fas fa-user"></i>
            <span>{{ $t('settings.profile') }}</span>
          </router-link>
        </li>
        <li>
          <a href="#" @click.prevent="logout" :data-title="$t('auth.logout')">
            <i class="fas fa-sign-out-alt"></i>
            <span>{{ $t('auth.logout') }}</span>
          </a>
        </li>
      </ul>
    </div>
    
    <!-- Version -->
    <div class="sidebar-footer">
      <span>{{ $t('common.version') }}</span> 1.0.0
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// Get current route for active menu highlighting
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Computed property to get the current route name
const currentRoute = computed(() => route.name as string)

// Sidebar collapsed state
const isCollapsed = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Toggle sidebar collapse state
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebar-collapsed', isCollapsed.value.toString())
}

// Uncollapse sidebar
const uncollapseSidebar = () => {
  isCollapsed.value = false
  localStorage.setItem('sidebar-collapsed', 'false')
}

// Logout function
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Initialize sidebar state based on localStorage
onMounted(() => {
  const savedState = localStorage.getItem('sidebar-collapsed')
  if (savedState) {
    isCollapsed.value = savedState === 'true'
  }
})

// Handle window resize for mobile responsiveness
const handleWindowResize = () => {
  if (window.innerWidth <= 768 && !isCollapsed.value) {
    isCollapsed.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
  handleWindowResize() // Check on initial mount
})

// Cleanup event listener on component unmount
onMounted(() => {
  return () => {
    window.removeEventListener('resize', handleWindowResize)
  }
})
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sidebar);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  overflow-x: hidden;
}

/* RTL Support - Move sidebar to right */
html[dir="rtl"] .sidebar {
  left: auto;
  right: 0;
  border-right: none;
  border-left: 1px solid var(--border-color);
  transform: translateX(0);
}

/* Collapsed sidebar styles */
.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
  padding: var(--spacing-4) var(--spacing-2);
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-6);
  padding: 0 var(--spacing-2);
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  transition: transform 0.3s, opacity 0.3s;
  margin-left: var(--spacing-1);
}

.logo i {
  font-size: var(--font-size-2xl);
  margin-right: var(--spacing-2);
  transition: margin 0.3s, transform 0.3s;
  color: var(--color-primary);
}

:deep(html[dir="rtl"]) .logo {
  margin-left: 0;
  margin-right: var(--spacing-1);
}

:deep(html[dir="rtl"]) .logo i {
  margin-right: 0;
  margin-left: var(--spacing-2);
}

/* Collapsed sidebar effects for logo */
.sidebar.collapsed .logo {
  transform: translateX(8px);
  justify-content: center;
  margin-left: 0;
}

:deep(html[dir="rtl"]) .sidebar.collapsed .logo {
  transform: translateX(-8px);
  margin-right: 0;
}

.sidebar.collapsed .logo i {
  margin-right: 0;
  margin-left: 0;
}

.sidebar.collapsed .logo span {
  opacity: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  transition: opacity 0.2s, width 0.3s;
  position: absolute;
  left: -9999px;
}

:deep(html[dir="rtl"]) .sidebar.collapsed .logo span {
  left: auto;
  right: -9999px;
}

.sidebar-section {
  margin-bottom: var(--spacing-6);
}

.sidebar-section h3 {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: opacity 0.2s ease;
}

.sidebar.collapsed .sidebar-section h3 {
  opacity: 0;
  visibility: hidden;
  height: 0;
  margin: 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: var(--spacing-1);
  width: 100%;
}

.sidebar-menu a {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--border-radius);
  color: var(--sidebar-color);
  font-weight: 500;
  transition: padding 0.3s, background-color 0.2s;
  white-space: nowrap;
  width: 100%;
  text-decoration: none;
}

.sidebar.collapsed .sidebar-menu a {
  padding: var(--spacing-3);
  justify-content: center;
  position: relative;
}

.sidebar.collapsed .sidebar-menu a:hover::after {
  content: attr(data-title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-gray-800);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-left: 10px;
}

:deep(html[dir="rtl"]) .sidebar.collapsed .sidebar-menu a:hover::after {
  left: auto;
  right: 100%;
  margin-left: 0;
  margin-right: 10px;
}

.sidebar-menu a i {
  font-size: var(--font-size-lg);
  margin-right: var(--spacing-3);
  width: 24px;
  text-align: center;
  transition: margin 0.3s;
}

:deep(html[dir="rtl"]) .sidebar-menu a i {
  margin-right: 0;
  margin-left: var(--spacing-3);
}

.sidebar.collapsed .sidebar-menu a i {
  margin-right: 0;
  margin-left: 0;
}

.sidebar-menu a span {
  transition: opacity 0.2s, transform 0.2s;
}

.sidebar.collapsed .sidebar-menu a span {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
  height: 0;
  overflow: hidden;
}

.sidebar-menu a:hover {
  background-color: var(--hover-bg);
}

.sidebar-menu li.active a {
  background-color: var(--color-primary);
  color: white;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: var(--spacing-6);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-align: center;
  transition: opacity 0.3s, transform 0.3s;
}

.sidebar.collapsed .sidebar-footer {
  opacity: 0;
  transform: translateY(20px);
  height: 0;
  padding: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }
  
  html[dir="rtl"] .sidebar {
    transform: translateX(100%);
  }
  
  .app-container:not(.sidebar-collapsed) .sidebar {
    transform: translateX(0);
  }
  
  .sidebar.visible {
    transform: translateX(0);
  }
  
  .sidebar-uncollapse.visible {
    display: none;
  }
}
</style> 