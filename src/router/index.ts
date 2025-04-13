import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('@/views/AccountsView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/accounts/:id',
      name: 'account-details',
      component: () => import('@/views/AccountDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/send-message',
      name: 'send-message',
      component: () => import('@/views/SendMessageView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/message-log',
      name: 'message-log',
      component: () => import('@/views/MessageLogView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (requiresAuth) {
    if (!token || !user) {
      next('/login')
      return
    }

    if (!authStore.isAuthenticated) {
      try {
        await authStore.checkAuth()
        next()
      } catch (error) {
        next('/login')
      }
    } else {
      next()
    }
  } else if ((to.path === '/login' || to.path === '/register') && token && user) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 