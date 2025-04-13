import { defineStore } from 'pinia'
import instanceService from '@/services/instanceService'
import { Instance } from '@/types'
import { useToast } from 'vue-toastification'

export const useInstanceStore = defineStore('instance', {
  state: () => ({
    instances: [] as Instance[],
    currentInstance: null as Instance | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    connectedInstances: (state) => state.instances.filter(instance => instance.status === 'connected'),
    disconnectedInstances: (state) => state.instances.filter(instance => instance.status === 'disconnected'),
    totalInstances: (state) => state.instances.length
  },

  actions: {
    async fetchInstances() {
      this.loading = true
      this.error = null

      try {
        const instances = await instanceService.getAllInstances()
        this.instances = instances
        return instances
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchInstance(id: number) {
      this.loading = true
      this.error = null

      try {
        const instance = await instanceService.getInstance(id)
        // Update in the instances array if it exists
        const index = this.instances.findIndex(i => i.id === id)
        if (index !== -1) {
          this.instances[index] = instance
        } else {
          this.instances.push(instance)
        }
        this.currentInstance = instance
        return instance
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createInstance(instanceName: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const instance = await instanceService.createInstance(instanceName)
        this.instances.push(instance)
        toast.success('Instance created successfully')
        return instance
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create instance: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteInstance(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await instanceService.deleteInstance(id)
        this.instances = this.instances.filter(instance => instance.id !== id)
        if (this.currentInstance && this.currentInstance.id === id) {
          this.currentInstance = null
        }
        toast.success('Instance deleted successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to delete instance: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getQRCode(id: number) {
      this.loading = true
      this.error = null

      try {
        return await instanceService.getQRCode(id)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async refreshQRCode(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const qrCode = await instanceService.refreshQRCode(id)
        toast.success('QR code refreshed')
        return qrCode
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to refresh QR code: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async disconnectInstance(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await instanceService.disconnectInstance(id)
        // Update the instance status
        const instance = this.instances.find(i => i.id === id)
        if (instance) {
          instance.status = 'disconnected'
        }
        toast.success('Instance disconnected successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to disconnect instance: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async reconnectInstance(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await instanceService.reconnectInstance(id)
        // Update the instance status
        const instance = this.instances.find(i => i.id === id)
        if (instance) {
          instance.status = 'initializing'
        }
        toast.success('Reconnecting instance...')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to reconnect instance: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleChatbot(id: number, isActive: boolean) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await instanceService.toggleChatbot(id, isActive)
        // Update the instance
        const instance = this.instances.find(i => i.id === id)
        if (instance) {
          instance.is_chatbot_active = isActive
        }
        toast.success(`Chatbot ${isActive ? 'enabled' : 'disabled'} successfully`)
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to ${isActive ? 'enable' : 'disable'} chatbot: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentInstance(instance: Instance | null) {
      this.currentInstance = instance
    },

    clearInstances() {
      this.instances = []
      this.currentInstance = null
    },

    clearErrors() {
      this.error = null
    }
  }
}) 