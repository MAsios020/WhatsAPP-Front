<template>
  <div class="app-container" :class="{ 'sidebar-collapsed': sidebarCollapsed, 'sidebar-visible': sidebarVisible }">
    <Sidebar v-model="sidebarCollapsed" />
    
    <!-- Mobile overlay when sidebar is visible -->
    <div class="mobile-overlay" v-if="sidebarVisible" @click="closeSidebarOnMobile"></div>
    
    <main class="main-content">
      <Header 
        :sidebar-collapsed="sidebarCollapsed" 
        @search="handleSearch"
        @toggle-sidebar="toggleSidebar"
      />
      
      <div class="content-wrapper">
        <slot></slot>
      </div>
      
      <!-- Mobile navigation footer -->
      <div class="mobile-nav-footer">
        <router-link to="/dashboard" class="mobile-nav-item">
          <i class="fas fa-tachometer-alt"></i>
          <span>{{ $t('dashboard.title') }}</span>
        </router-link>
        <router-link to="/accounts" class="mobile-nav-item">
          <i class="fas fa-mobile-alt"></i>
          <span>{{ $t('accounts.title') }}</span>
        </router-link>
        <router-link to="/send-message" class="mobile-nav-item">
          <i class="fas fa-paper-plane"></i>
          <span>{{ $t('messages.sendMessage') }}</span>
        </router-link>
        <router-link to="/settings" class="mobile-nav-item">
          <i class="fas fa-cog"></i>
          <span>{{ $t('settings.title') }}</span>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

// Sidebar collapse state with localStorage persistence
const sidebarCollapsed = ref(false)
const sidebarVisible = ref(false)
const route = useRoute()
const router = useRouter()

// Define emits for search events
const emit = defineEmits(['search-accounts', 'search-messages', 'search-dashboard'])

// Handle search query from header
const handleSearch = (query: string) => {
  if (!query.trim()) return;
  
  // Log search query
  console.log('Searching for:', query);
  
  // Handle search based on current route
  if (route.name === 'accounts') {
    // Filter accounts by name or phone number
    const searchTerm = query.toLowerCase();
    // Emit search event to be caught by the accounts page
    emit('search-accounts', searchTerm);
  } else if (route.name === 'message-log') {
    // Search in messages
    emit('search-messages', query);
  } else if (route.name === 'dashboard') {
    // Search in dashboard
    emit('search-dashboard', query);
  } else {
    // Global search across app
    router.push({ path: '/search', query: { q: query }});
  }
}

// Toggle sidebar on mobile
const toggleSidebar = (value?: boolean) => {
  if (typeof value !== 'undefined') {
    sidebarCollapsed.value = value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  if (window.innerWidth <= 768) {
    sidebarVisible.value = !sidebarCollapsed.value
  }
}

// Close sidebar when clicking the overlay on mobile
const closeSidebarOnMobile = () => {
  sidebarCollapsed.value = true
  sidebarVisible.value = false
}

// Provide sidebar collapsed state to child components
provide('sidebarCollapsed', sidebarCollapsed)

// Initialize sidebar state from localStorage on component mount
onMounted(() => {
  const savedState = localStorage.getItem('sidebar-collapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }
  
  // On mobile, sidebar is always collapsed initially
  if (window.innerWidth <= 768) {
    sidebarCollapsed.value = true
    sidebarVisible.value = false
  }
})

// Persist sidebar state to localStorage when it changes
watch(sidebarCollapsed, (newVal) => {
  localStorage.setItem('sidebar-collapsed', newVal.toString())
})

// Handle window resize for mobile responsiveness
const handleWindowResize = () => {
  // Automatically collapse sidebar on small screens
  if (window.innerWidth <= 768) {
    if (!sidebarCollapsed.value) {
      sidebarCollapsed.value = true
      sidebarVisible.value = false
    }
  } else {
    // On desktop, reset sidebar visibility
    sidebarVisible.value = false
  }
}

// Close sidebar when route changes on mobile
watch(() => route.path, () => {
  if (window.innerWidth <= 768) {
    sidebarCollapsed.value = true
    sidebarVisible.value = false
  }
})

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
  handleWindowResize() // Check on initial mount
  
  // Clean up the event listener when the component is unmounted
  return () => {
    window.removeEventListener('resize', handleWindowResize)
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  position: relative;
  transition: var(--transition);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

[dir="rtl"] .main-content {
  margin-left: 0;
  margin-right: var(--sidebar-width);
}

/* Collapsed sidebar affects */
.app-container.sidebar-collapsed .main-content {
  margin-left: var(--sidebar-collapsed-width);
}

[dir="rtl"] .app-container.sidebar-collapsed .main-content {
  margin-left: 0;
  margin-right: var(--sidebar-collapsed-width);
}

.content-wrapper {
  padding: var(--spacing-6);
  flex: 1;
  background-color: var(--bg-color);
  transition: padding 0.3s ease;
}

/* Mobile overlay for sidebar */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
  animation: fadeIn 0.3s ease;
}

/* Mobile navigation footer */
.mobile-nav-footer {
  display: none;
  height: 60px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--header-bg);
  border-top: 1px solid var(--border-color);
  z-index: 800;
  display: none;
  align-items: center;
  justify-content: space-around;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  padding: var(--spacing-2);
  font-size: 0.75rem;
}

.mobile-nav-item i {
  font-size: 1.25rem;
  margin-bottom: 4px;
}

.mobile-nav-item.router-link-active {
  color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .content-wrapper {
    padding: var(--spacing-4);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-bottom: 60px;
  }
  
  .app-container.sidebar-visible .mobile-overlay {
    display: block;
  }
  
  .mobile-nav-footer {
    display: flex;
  }
  
  .content-wrapper {
    padding: var(--spacing-3);
  }
}

/* Animation for content display */
.content-wrapper {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 