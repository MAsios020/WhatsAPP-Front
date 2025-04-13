import { defineStore } from 'pinia'
import statisticService from '@/services/statisticService'
import { DashboardStats, MessagesByStatus, InstancesByStatus, TopContacts } from '@/types'
import { useToast } from 'vue-toastification'

export const useStatisticStore = defineStore('statistic', {
  state: () => ({
    dashboardStats: null as DashboardStats | null,
    messagesByStatus: [] as MessagesByStatus[],
    instancesByStatus: [] as InstancesByStatus[],
    topContacts: [] as TopContacts[],
    period: 'all' as 'today' | 'week' | 'month' | 'all',
    loading: false,
    error: null as string | null
  }),

  getters: {
    totalMessages: (state) => state.dashboardStats?.total_messages || 0,
    totalInstances: (state) => state.dashboardStats?.total_instances || 0,
    totalContacts: (state) => state.dashboardStats?.total_contacts || 0,
    totalCampaigns: (state) => state.dashboardStats?.total_campaigns || 0,
    connectedInstances: (state) => state.dashboardStats?.connected_instances || 0,
    disconnectedInstances: (state) => state.dashboardStats?.disconnected_instances || 0,
    sentMessages: (state) => state.dashboardStats?.sent_messages || 0,
    deliveredMessages: (state) => state.dashboardStats?.delivered_messages || 0,
    readMessages: (state) => state.dashboardStats?.read_messages || 0,
    failedMessages: (state) => state.dashboardStats?.failed_messages || 0,
    pendingMessages: (state) => state.dashboardStats?.pending_messages || 0,
    activeCampaigns: (state) => state.dashboardStats?.active_campaigns || 0,
    completedCampaigns: (state) => state.dashboardStats?.completed_campaigns || 0,
    draftCampaigns: (state) => state.dashboardStats?.draft_campaigns || 0,
    currentPeriod: (state) => state.period
  },

  actions: {
    async fetchDashboardStats(period?: 'today' | 'week' | 'month' | 'all') {
      this.loading = true
      this.error = null
      
      if (period) {
        this.period = period
      }

      try {
        const stats = await statisticService.getDashboardStats(this.period)
        this.dashboardStats = stats
        return stats
      } catch (error: any) {
        this.error = error.message
        const toast = useToast()
        toast.error(`Failed to fetch dashboard statistics: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMessagesByStatus(period?: 'today' | 'week' | 'month' | 'all') {
      this.loading = true
      this.error = null
      
      if (period) {
        this.period = period
      }

      try {
        const stats = await statisticService.getMessagesByStatus(this.period)
        this.messagesByStatus = stats
        return stats
      } catch (error: any) {
        this.error = error.message
        const toast = useToast()
        toast.error(`Failed to fetch message statistics: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchInstancesByStatus(period?: 'today' | 'week' | 'month' | 'all') {
      this.loading = true
      this.error = null
      
      if (period) {
        this.period = period
      }

      try {
        const stats = await statisticService.getInstancesByStatus(this.period)
        this.instancesByStatus = stats
        return stats
      } catch (error: any) {
        this.error = error.message
        const toast = useToast()
        toast.error(`Failed to fetch instance statistics: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTopContacts(limit = 10, period?: 'today' | 'week' | 'month' | 'all') {
      this.loading = true
      this.error = null
      
      if (period) {
        this.period = period
      }

      try {
        const contacts = await statisticService.getTopContacts(limit, this.period)
        this.topContacts = contacts
        return contacts
      } catch (error: any) {
        this.error = error.message
        const toast = useToast()
        toast.error(`Failed to fetch top contacts: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAllStats(period?: 'today' | 'week' | 'month' | 'all') {
      this.loading = true
      this.error = null
      
      if (period) {
        this.period = period
      }

      try {
        const [dashboardStats, messagesByStatus, instancesByStatus, topContacts] = await Promise.all([
          statisticService.getDashboardStats(this.period),
          statisticService.getMessagesByStatus(this.period),
          statisticService.getInstancesByStatus(this.period),
          statisticService.getTopContacts(10, this.period)
        ])

        this.dashboardStats = dashboardStats
        this.messagesByStatus = messagesByStatus
        this.instancesByStatus = instancesByStatus
        this.topContacts = topContacts

        return {
          dashboardStats,
          messagesByStatus,
          instancesByStatus,
          topContacts
        }
      } catch (error: any) {
        this.error = error.message
        const toast = useToast()
        toast.error(`Failed to fetch statistics: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    setPeriod(period: 'today' | 'week' | 'month' | 'all') {
      this.period = period
    },

    clearStats() {
      this.dashboardStats = null
      this.messagesByStatus = []
      this.instancesByStatus = []
      this.topContacts = []
    },

    clearErrors() {
      this.error = null
    }
  }
}) 