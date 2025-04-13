<template>
  <header class="header">
    <!-- Mobile Menu Toggle Button -->
    <div class="header-left">
      <button 
        class="sidebar-toggle"
        @click="toggleMobileMenu"
        :title="$t('common.toggleSidebar')"
      >
        <i class="fas fa-bars"></i>
      </button>
      
      <!-- Header Search - Removing this as requested -->
      <!-- <div class="header-search">
        <i class="fas fa-search"></i>
        <input type="text" :placeholder="$t('common.search')">
      </div> -->
    </div>
    
    <div class="header-actions">
      <LanguageToggle class="header-action" />
      <ThemeToggle class="header-action" />
      
      <div class="user-profile" @click="toggleProfileMenu">
        <img :src="userAvatar" :alt="userName">
        <span class="user-name">{{ userName }}</span>
        <i class="fas fa-chevron-down profile-arrow"></i>
        
        <div class="profile-dropdown" :class="{ 'show': showProfileMenu }">
          <ul>
            <li>
              <router-link to="/profile">
                <i class="fas fa-user"></i>
                {{ $t('settings.profile') }}
              </router-link>
            </li>
            <li>
              <router-link to="/settings">
                <i class="fas fa-cog"></i>
                {{ $t('settings.title') }}
              </router-link>
            </li>
            <li class="divider"></li>
            <li @click="logout">
              <a href="#" @click.prevent>
                <i class="fas fa-sign-out-alt"></i>
                {{ $t('auth.logout') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LanguageToggle from '@/components/LanguageToggle.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()
const sidebarCollapsed = inject('sidebarCollapsed', ref(false))

// Toggle mobile menu - controls sidebar visibility on mobile
const toggleMobileMenu = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  emit('toggle-sidebar', sidebarCollapsed.value)
}

// User data
const userName = computed(() => {
  const name = authStore.user?.name || authStore.user?.username || authStore.user?.email
  return name || 'User'
})

const userAvatar = computed(() => {
  return authStore.user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'
})

// Search functionality
const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

// Profile dropdown
const showProfileMenu = ref(false)

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

// Close profile menu when clicking outside
const closeProfileMenuOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const profileContainer = document.querySelector('.user-profile')
  
  if (profileContainer && !profileContainer.contains(target) && showProfileMenu.value) {
    showProfileMenu.value = false
  }
}

// Logout function
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', closeProfileMenuOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeProfileMenuOnClickOutside)
})
</script>

<style scoped>
.header {
  height: var(--header-height, 70px);
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-4);
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  transition: all 0.3s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.sidebar-toggle {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius);
  border: none;
  background-color: var(--bg-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.sidebar-toggle:hover {
  background-color: var(--hover-bg);
  transform: translateY(-2px);
}

.sidebar-toggle:active {
  transform: translateY(0);
}

html[dir="rtl"] .sidebar-toggle i {
  transform: rotate(180deg);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.header-action {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.header-action:hover {
  transform: translateY(-2px);
}

.user-profile {
  display: flex;
  align-items: center;
  margin-left: var(--spacing-3);
  cursor: pointer;
  position: relative;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius);
  transition: background-color 0.3s ease;
}

html[dir="rtl"] .user-profile {
  margin-left: 0;
  margin-right: var(--spacing-3);
}

.user-profile:hover {
  background-color: var(--hover-bg);
}

.user-profile img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--spacing-2);
  border: 2px solid var(--border-color);
  transition: border-color 0.3s ease;
}

html[dir="rtl"] .user-profile img {
  margin-right: 0;
  margin-left: var(--spacing-2);
}

.user-profile:hover img {
  border-color: var(--color-primary);
}

.user-name {
  font-weight: 500;
  transition: color 0.3s ease;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-arrow {
  font-size: 0.75rem;
  margin-left: var(--spacing-2);
  opacity: 0.7;
  transition: transform 0.3s ease;
}

html[dir="rtl"] .profile-arrow {
  margin-left: 0;
  margin-right: var(--spacing-2);
}

.user-profile:hover .profile-arrow {
  opacity: 1;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 200px;
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
}

html[dir="rtl"] .profile-dropdown {
  right: auto;
  left: 0;
}

.profile-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.profile-dropdown ul {
  list-style: none;
  padding: 0;
}

.profile-dropdown li {
  padding: 0;
}

.profile-dropdown li a {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--text-color);
  transition: background-color 0.3s ease;
}

.profile-dropdown li a:hover {
  background-color: var(--hover-bg);
  color: var(--color-primary);
}

.profile-dropdown li a i {
  margin-right: var(--spacing-3);
  width: 16px;
  text-align: center;
}

html[dir="rtl"] .profile-dropdown li a i {
  margin-right: 0;
  margin-left: var(--spacing-3);
}

.profile-dropdown .divider {
  height: 1px;
  background-color: var(--border-color);
  margin: var(--spacing-1) 0;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header {
    padding: 0 var(--spacing-3);
  }
  
  .sidebar-toggle {
    margin-right: var(--spacing-2);
  }
  
  html[dir="rtl"] .sidebar-toggle {
    margin-right: 0;
    margin-left: var(--spacing-2);
  }
  
  .user-name {
    display: none;
  }
  
  .profile-arrow {
    display: none;
  }
  
  .profile-dropdown {
    right: -80px;
  }
  
  html[dir="rtl"] .profile-dropdown {
    right: auto;
    left: -80px;
  }
}

@media (max-width: 480px) {
  .header-search {
    display: none;
  }
}
</style> 