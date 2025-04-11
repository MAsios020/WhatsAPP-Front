import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    isAuthenticated: false,
    loading: false
  }),

  actions: {
    async login(credentials: { username: string; password: string }) {
      const router = useRouter()
      const toast = useToast()
      const { t } = useI18n()
      
      this.loading = true
      try {
        const response = await authService.login(credentials)
        this.user = response.user
        this.isAuthenticated = true
        toast.success(t('auth.loginSuccess'))
        router.push('/dashboard')
        return response
      } catch (error: any) {
        toast.error(error.message || t('errors.loginFailed'))
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: { email: string; password: string; phone: string; accountName: string }) {
      const router = useRouter()
      const toast = useToast()
      const { t } = useI18n()
      
      this.loading = true
      try {
        const response = await authService.register(userData)
        this.user = response.user
        this.isAuthenticated = true
        toast.success(t('auth.registerSuccess'))
        router.push('/dashboard')
        return response
      } catch (error: any) {
        toast.error(error.message || t('errors.registerFailed'))
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const router = useRouter()
      const toast = useToast()
      const { t } = useI18n()
      
      try {
        authService.logout()
        this.user = null
        this.isAuthenticated = false
        toast.success(t('auth.logoutSuccess'))
        router.push('/login')
      } catch (error: any) {
        toast.error(error.message || t('errors.logoutFailed'))
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