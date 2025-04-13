import { defineStore } from 'pinia'
import messageService from '@/services/messageService'
import { Message, MessageTemplate } from '@/types'
import { useToast } from 'vue-toastification'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as Message[],
    templates: [] as MessageTemplate[],
    currentTemplate: null as MessageTemplate | null,
    loading: false,
    error: null as string | null,
    totalMessages: 0,
    messageStats: {
      total: 0,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0
    }
  }),

  getters: {
    sentMessages: (state) => state.messages.filter(msg => msg.status === 'sent'),
    deliveredMessages: (state) => state.messages.filter(msg => msg.status === 'delivered'),
    readMessages: (state) => state.messages.filter(msg => msg.status === 'read'),
    failedMessages: (state) => state.messages.filter(msg => msg.status === 'failed'),
    pendingMessages: (state) => state.messages.filter(msg => msg.status === 'pending')
  },

  actions: {
    async fetchMessages(page = 1, limit = 20, status?: string) {
      this.loading = true
      this.error = null

      try {
        const result = await messageService.getMessages(page, limit, status)
        this.messages = result.messages
        this.totalMessages = result.total
        return result
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMessagesByInstance(instanceId: number, page = 1, limit = 20) {
      this.loading = true
      this.error = null

      try {
        const result = await messageService.getMessagesByInstance(instanceId, page, limit)
        this.messages = result.messages
        this.totalMessages = result.total
        return result
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMessagesByContact(contactId: number, page = 1, limit = 20) {
      this.loading = true
      this.error = null

      try {
        const result = await messageService.getMessagesByContact(contactId, page, limit)
        this.messages = result.messages
        this.totalMessages = result.total
        return result
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendMessage(instanceId: number, contactId: number, message: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const sentMessage = await messageService.sendMessage(instanceId, contactId, message)
        this.messages.unshift(sentMessage)
        toast.success('Message sent successfully')
        return sentMessage
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to send message: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendBulkMessage(instanceId: number, contactIds: number[], message: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const result = await messageService.sendBulkMessage(instanceId, contactIds, message)
        // Add the new messages to our collection
        this.messages = [...result.messages, ...this.messages]
        toast.success(`Sent ${result.success} messages. Failed: ${result.failed}`)
        return result
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to send bulk message: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkMessageStatus(messageUid: string) {
      try {
        const status = await messageService.getMessageStatus(messageUid)
        // Update the message status in our store
        const message = this.messages.find(msg => msg.message_uid === messageUid)
        if (message) {
          message.status = status as 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
        }
        return status
      } catch (error: any) {
        console.error('Failed to check message status:', error)
        return 'unknown'
      }
    },

    async fetchMessageStats(timeframe?: string) {
      this.loading = true
      this.error = null

      try {
        const stats = await messageService.getMessageStats(timeframe)
        this.messageStats = stats
        return stats
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Template methods
    async fetchTemplates() {
      this.loading = true
      this.error = null

      try {
        const templates = await messageService.getTemplates()
        this.templates = templates
        return templates
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTemplate(id: number) {
      this.loading = true
      this.error = null

      try {
        const template = await messageService.getTemplate(id)
        // Update in array if exists
        const index = this.templates.findIndex(t => t.id === id)
        if (index !== -1) {
          this.templates[index] = template
        } else {
          this.templates.push(template)
        }
        this.currentTemplate = template
        return template
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTemplate(templateName: string, messageText: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const template = await messageService.createTemplate(templateName, messageText)
        this.templates.push(template)
        toast.success('Template created successfully')
        return template
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create template: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTemplate(id: number, templateName: string, messageText: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const template = await messageService.updateTemplate(id, templateName, messageText)
        // Update in array
        const index = this.templates.findIndex(t => t.id === id)
        if (index !== -1) {
          this.templates[index] = template
        }
        if (this.currentTemplate && this.currentTemplate.id === id) {
          this.currentTemplate = template
        }
        toast.success('Template updated successfully')
        return template
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to update template: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTemplate(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await messageService.deleteTemplate(id)
        this.templates = this.templates.filter(template => template.id !== id)
        if (this.currentTemplate && this.currentTemplate.id === id) {
          this.currentTemplate = null
        }
        toast.success('Template deleted successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to delete template: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentTemplate(template: MessageTemplate | null) {
      this.currentTemplate = template
    },

    clearMessages() {
      this.messages = []
    },

    clearTemplates() {
      this.templates = []
      this.currentTemplate = null
    },

    clearErrors() {
      this.error = null
    }
  }
}) 