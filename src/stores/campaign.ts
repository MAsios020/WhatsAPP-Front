import { defineStore } from 'pinia'
import campaignService from '@/services/campaignService'
import { Campaign, CampaignStats } from '@/types'
import { useToast } from 'vue-toastification'

export const useCampaignStore = defineStore('campaign', {
  state: () => ({
    campaigns: [] as Campaign[],
    currentCampaign: null as Campaign | null,
    loading: false,
    error: null as string | null,
    totalCampaigns: 0,
    campaignStats: null as CampaignStats | null
  }),

  getters: {
    runningCampaigns: (state) => state.campaigns.filter(campaign => campaign.status === 'running'),
    scheduledCampaigns: (state) => state.campaigns.filter(campaign => campaign.status === 'scheduled'),
    completedCampaigns: (state) => state.campaigns.filter(campaign => campaign.status === 'completed'),
    draftCampaigns: (state) => state.campaigns.filter(campaign => campaign.status === 'draft')
  },

  actions: {
    async fetchCampaigns(page = 1, limit = 20, status?: string) {
      this.loading = true
      this.error = null

      try {
        const result = await campaignService.getCampaigns(page, limit, status)
        this.campaigns = result.campaigns
        this.totalCampaigns = result.total
        return result
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCampaign(id: number) {
      this.loading = true
      this.error = null

      try {
        const campaign = await campaignService.getCampaign(id)
        // Update in the campaigns array if it exists
        const index = this.campaigns.findIndex(c => c.id === id)
        if (index !== -1) {
          this.campaigns[index] = campaign
        } else {
          this.campaigns.push(campaign)
        }
        this.currentCampaign = campaign
        return campaign
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCampaign(campaignName: string, messageTemplateId: number, intervalTime: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const campaign = await campaignService.createCampaign(
          campaignName,
          messageTemplateId,
          intervalTime
        )
        this.campaigns.push(campaign)
        toast.success('Campaign created successfully')
        return campaign
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCampaign(id: number, campaignName: string, messageTemplateId: number, intervalTime: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const campaign = await campaignService.updateCampaign(
          id,
          campaignName,
          messageTemplateId,
          intervalTime
        )
        // Update in the campaigns array
        const index = this.campaigns.findIndex(c => c.id === id)
        if (index !== -1) {
          this.campaigns[index] = campaign
        }
        if (this.currentCampaign && this.currentCampaign.id === id) {
          this.currentCampaign = campaign
        }
        toast.success('Campaign updated successfully')
        return campaign
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to update campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCampaign(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await campaignService.deleteCampaign(id)
        this.campaigns = this.campaigns.filter(campaign => campaign.id !== id)
        if (this.currentCampaign && this.currentCampaign.id === id) {
          this.currentCampaign = null
        }
        toast.success('Campaign deleted successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to delete campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async startCampaign(id: number, contactIds: number[], instanceId: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await campaignService.startCampaign(id, contactIds, instanceId)
        // Update campaign status
        const campaign = this.campaigns.find(c => c.id === id)
        if (campaign) {
          campaign.status = 'running'
        }
        toast.success('Campaign started successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to start campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async pauseCampaign(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await campaignService.pauseCampaign(id)
        // Update campaign status
        const campaign = this.campaigns.find(c => c.id === id)
        if (campaign) {
          campaign.status = 'paused'
        }
        toast.success('Campaign paused successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to pause campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async resumeCampaign(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await campaignService.resumeCampaign(id)
        // Update campaign status
        const campaign = this.campaigns.find(c => c.id === id)
        if (campaign) {
          campaign.status = 'running'
        }
        toast.success('Campaign resumed successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to resume campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async stopCampaign(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await campaignService.stopCampaign(id)
        // Update campaign status
        const campaign = this.campaigns.find(c => c.id === id)
        if (campaign) {
          campaign.status = 'completed'
        }
        toast.success('Campaign stopped successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to stop campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCampaignStats() {
      this.loading = true
      this.error = null

      try {
        const stats = await campaignService.getCampaignStats()
        this.campaignStats = stats
        return stats
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCampaignContacts(id: number) {
      this.loading = true
      this.error = null

      try {
        return await campaignService.getCampaignContacts(id)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addContactsToCampaign(id: number, contactIds: number[]) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await campaignService.addContactsToCampaign(id, contactIds)
        toast.success('Contacts added to campaign successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to add contacts to campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeContactsFromCampaign(id: number, contactIds: number[]) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await campaignService.removeContactsFromCampaign(id, contactIds)
        toast.success('Contacts removed from campaign successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to remove contacts from campaign: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentCampaign(campaign: Campaign | null) {
      this.currentCampaign = campaign
    },

    clearCampaigns() {
      this.campaigns = []
      this.currentCampaign = null
    },

    clearErrors() {
      this.error = null
    }
  }
}) 