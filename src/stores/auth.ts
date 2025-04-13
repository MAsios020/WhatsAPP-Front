import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      isAuthenticated: !!storedToken,
      loading: false
    }
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      this.loading = true
      try {
        const response = await authService.login(credentials)
        this.user = response.user
        this.isAuthenticated = true
        return response
      } finally {
        this.loading = false
      }
    },

    async register(userData: { email: string; password: string; phone: string; accountName: string }) {
      this.loading = true
      try {
        const response = await authService.register(userData)
        this.user = response.user
        this.isAuthenticated = true
        return response
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const router = useRouter()
      const toast = useToast()
      try {
        authService.logout()
        this.user = null
        this.isAuthenticated = false
        toast.success('Logged out successfully')
        router.push('/login')
      } catch (error: any) {
        toast.error( 'Failed to logout')
      }
    },

    async checkAuth() {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.verifyToken()
          this.user = response.user
          this.isAuthenticated = true
        } catch (error) {
          this.logout()
        }
      }
    }
  }
}) 