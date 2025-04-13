import { defineStore } from 'pinia'
import subscriptionService from '@/services/subscriptionService'
import { Subscription, Package, Payment } from '@/types'
import { useToast } from 'vue-toastification'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptions: [] as Subscription[],
    currentSubscription: null as Subscription | null,
    packages: [] as Package[],
    selectedPackage: null as Package | null,
    payments: [] as Payment[],
    loading: false,
    error: null as string | null,
    limits: {
      instances: { used: 0, limit: 0 },
      contacts: { used: 0, limit: 0 },
      messages: { used: 0, limit: 0 }
    }
  }),

  getters: {
    activeSubscription: (state) => {
      return state.currentSubscription && state.currentSubscription.status === 'active'
        ? state.currentSubscription
        : null
    },
    hasActiveSubscription: (state) => {
      return state.currentSubscription?.status === 'active'
    },
    instancesRemaining: (state) => {
      return state.limits.instances.limit - state.limits.instances.used
    },
    contactsRemaining: (state) => {
      return state.limits.contacts.limit - state.limits.contacts.used
    },
    messagesRemaining: (state) => {
      return state.limits.messages.limit - state.limits.messages.used
    },
    instancesUsagePercentage: (state) => {
      return state.limits.instances.limit === 0
        ? 0
        : Math.round((state.limits.instances.used / state.limits.instances.limit) * 100)
    },
    contactsUsagePercentage: (state) => {
      return state.limits.contacts.limit === 0
        ? 0
        : Math.round((state.limits.contacts.used / state.limits.contacts.limit) * 100)
    },
    messagesUsagePercentage: (state) => {
      return state.limits.messages.limit === 0
        ? 0
        : Math.round((state.limits.messages.used / state.limits.messages.limit) * 100)
    }
  },

  actions: {
    // Package actions
    async fetchPackages() {
      this.loading = true
      this.error = null

      try {
        const packages = await subscriptionService.getPackages()
        this.packages = packages
        return packages
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPackage(id: number) {
      this.loading = true
      this.error = null

      try {
        const pkg = await subscriptionService.getPackage(id)
        // Update in the packages array if it exists
        const index = this.packages.findIndex(p => p.id === id)
        if (index !== -1) {
          this.packages[index] = pkg
        } else {
          this.packages.push(pkg)
        }
        this.selectedPackage = pkg
        return pkg
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Subscription actions
    async fetchSubscriptions() {
      this.loading = true
      this.error = null

      try {
        const subscriptions = await subscriptionService.getSubscriptions()
        this.subscriptions = subscriptions
        return subscriptions
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurrentSubscription() {
      this.loading = true
      this.error = null

      try {
        const subscription = await subscriptionService.getCurrentSubscription()
        this.currentSubscription = subscription
        return subscription
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSubscription(id: number) {
      this.loading = true
      this.error = null

      try {
        const subscription = await subscriptionService.getSubscription(id)
        // Update in the subscriptions array if it exists
        const index = this.subscriptions.findIndex(s => s.id === id)
        if (index !== -1) {
          this.subscriptions[index] = subscription
        } else {
          this.subscriptions.push(subscription)
        }
        return subscription
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createSubscription(packageId: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const subscription = await subscriptionService.createSubscription(packageId)
        this.subscriptions.push(subscription)
        this.currentSubscription = subscription
        toast.success('Subscription created successfully')
        return subscription
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create subscription: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelSubscription(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await subscriptionService.cancelSubscription(id)
        // Update subscription status
        const subscription = this.subscriptions.find(s => s.id === id)
        if (subscription) {
          subscription.status = 'cancelled'
        }
        if (this.currentSubscription && this.currentSubscription.id === id) {
          this.currentSubscription.status = 'cancelled'
        }
        toast.success('Subscription cancelled successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to cancel subscription: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async renewSubscription(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const subscription = await subscriptionService.renewSubscription(id)
        // Update in the subscriptions array
        const index = this.subscriptions.findIndex(s => s.id === id)
        if (index !== -1) {
          this.subscriptions[index] = subscription
        }
        if (this.currentSubscription && this.currentSubscription.id === id) {
          this.currentSubscription = subscription
        }
        toast.success('Subscription renewed successfully')
        return subscription
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to renew subscription: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async upgradeSubscription(id: number, newPackageId: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const subscription = await subscriptionService.upgradeSubscription(id, newPackageId)
        // Update in the subscriptions array
        const index = this.subscriptions.findIndex(s => s.id === id)
        if (index !== -1) {
          this.subscriptions[index] = subscription
        }
        if (this.currentSubscription && this.currentSubscription.id === id) {
          this.currentSubscription = subscription
        }
        toast.success('Subscription upgraded successfully')
        return subscription
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to upgrade subscription: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Payment actions
    async fetchPayments(page = 1, limit = 20) {
      this.loading = true
      this.error = null

      try {
        const result = await subscriptionService.getPayments(page, limit)
        this.payments = result.payments
        return result
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPayment(subscriptionId: number, amount: number, paymentMethod: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const payment = await subscriptionService.createPayment(subscriptionId, amount, paymentMethod)
        this.payments.push(payment)
        toast.success('Payment processed successfully')
        return payment
      } catch (error: any) {
        this.error = error.message
        toast.error(`Payment failed: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSubscriptionLimits() {
      this.loading = true
      this.error = null

      try {
        const limits = await subscriptionService.getSubscriptionLimits()
        this.limits = limits
        return limits
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedPackage(pkg: Package | null) {
      this.selectedPackage = pkg
    },

    clearSubscriptions() {
      this.subscriptions = []
      this.currentSubscription = null
    },

    clearPackages() {
      this.packages = []
      this.selectedPackage = null
    },

    clearPayments() {
      this.payments = []
    },

    clearErrors() {
      this.error = null
    }
  }
}) 