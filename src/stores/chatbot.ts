import { defineStore } from 'pinia'
import chatbotService from '@/services/chatbotService'
import { Chatbot, ChatbotRule } from '@/types'
import { useToast } from 'vue-toastification'

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    chatbots: [] as Chatbot[],
    currentChatbot: null as Chatbot | null,
    rules: [] as ChatbotRule[],
    currentRule: null as ChatbotRule | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    activeChatbots: (state) => state.chatbots.filter(chatbot => chatbot.is_active),
    inactiveChatbots: (state) => state.chatbots.filter(chatbot => !chatbot.is_active)
  },

  actions: {
    // Chatbot actions
    async fetchChatbots() {
      this.loading = true
      this.error = null

      try {
        const chatbots = await chatbotService.getChatbots()
        this.chatbots = chatbots
        return chatbots
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchChatbot(id: number) {
      this.loading = true
      this.error = null

      try {
        const chatbot = await chatbotService.getChatbot(id)
        // Update in the chatbots array if it exists
        const index = this.chatbots.findIndex(c => c.id === id)
        if (index !== -1) {
          this.chatbots[index] = chatbot
        } else {
          this.chatbots.push(chatbot)
        }
        this.currentChatbot = chatbot
        return chatbot
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchChatbotByInstance(instanceId: number) {
      this.loading = true
      this.error = null

      try {
        const chatbot = await chatbotService.getChatbotByInstance(instanceId)
        if (chatbot) {
          // Update in the chatbots array if it exists
          const index = this.chatbots.findIndex(c => c.id === chatbot.id)
          if (index !== -1) {
            this.chatbots[index] = chatbot
          } else {
            this.chatbots.push(chatbot)
          }
          this.currentChatbot = chatbot
        } else {
          this.currentChatbot = null
        }
        return chatbot
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createChatbot(instanceId: number, chatbotName: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const chatbot = await chatbotService.createChatbot(instanceId, chatbotName)
        this.chatbots.push(chatbot)
        this.currentChatbot = chatbot
        toast.success('Chatbot created successfully')
        return chatbot
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create chatbot: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateChatbot(id: number, chatbotName: string, isActive: boolean) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const chatbot = await chatbotService.updateChatbot(id, chatbotName, isActive)
        // Update in the chatbots array
        const index = this.chatbots.findIndex(c => c.id === id)
        if (index !== -1) {
          this.chatbots[index] = chatbot
        }
        if (this.currentChatbot && this.currentChatbot.id === id) {
          this.currentChatbot = chatbot
        }
        toast.success('Chatbot updated successfully')
        return chatbot
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to update chatbot: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteChatbot(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await chatbotService.deleteChatbot(id)
        this.chatbots = this.chatbots.filter(chatbot => chatbot.id !== id)
        if (this.currentChatbot && this.currentChatbot.id === id) {
          this.currentChatbot = null
          this.rules = []
        }
        toast.success('Chatbot deleted successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to delete chatbot: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleChatbotActive(id: number, isActive: boolean) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await chatbotService.toggleChatbotActive(id, isActive)
        // Update in the chatbots array
        const chatbot = this.chatbots.find(c => c.id === id)
        if (chatbot) {
          chatbot.is_active = isActive
        }
        if (this.currentChatbot && this.currentChatbot.id === id) {
          this.currentChatbot.is_active = isActive
        }
        toast.success(`Chatbot ${isActive ? 'activated' : 'deactivated'} successfully`)
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to ${isActive ? 'activate' : 'deactivate'} chatbot: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Chatbot Rule actions
    async fetchChatbotRules(chatbotId: number) {
      this.loading = true
      this.error = null

      try {
        const rules = await chatbotService.getChatbotRules(chatbotId)
        this.rules = rules
        return rules
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchChatbotRule(chatbotId: number, ruleId: number) {
      this.loading = true
      this.error = null

      try {
        const rule = await chatbotService.getChatbotRule(chatbotId, ruleId)
        // Update in the rules array if it exists
        const index = this.rules.findIndex(r => r.id === ruleId)
        if (index !== -1) {
          this.rules[index] = rule
        } else {
          this.rules.push(rule)
        }
        this.currentRule = rule
        return rule
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createChatbotRule(
      chatbotId: number,
      ruleName: string,
      keyword: string,
      response: string,
      matchType: 'exact' | 'contains' | 'starts_with' | 'ends_with' | 'regex',
      caseSensitive: boolean,
      priority: number
    ) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const rule = await chatbotService.createChatbotRule(
          chatbotId,
          ruleName,
          keyword,
          response,
          matchType,
          caseSensitive,
          priority
        )
        this.rules.push(rule)
        toast.success('Rule created successfully')
        return rule
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create rule: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateChatbotRule(
      chatbotId: number,
      ruleId: number,
      ruleName: string,
      keyword: string,
      response: string,
      matchType: 'exact' | 'contains' | 'starts_with' | 'ends_with' | 'regex',
      caseSensitive: boolean,
      priority: number
    ) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const rule = await chatbotService.updateChatbotRule(
          chatbotId,
          ruleId,
          ruleName,
          keyword,
          response,
          matchType,
          caseSensitive,
          priority
        )
        // Update in the rules array
        const index = this.rules.findIndex(r => r.id === ruleId)
        if (index !== -1) {
          this.rules[index] = rule
        }
        if (this.currentRule && this.currentRule.id === ruleId) {
          this.currentRule = rule
        }
        toast.success('Rule updated successfully')
        return rule
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to update rule: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteChatbotRule(chatbotId: number, ruleId: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await chatbotService.deleteChatbotRule(chatbotId, ruleId)
        this.rules = this.rules.filter(rule => rule.id !== ruleId)
        if (this.currentRule && this.currentRule.id === ruleId) {
          this.currentRule = null
        }
        toast.success('Rule deleted successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to delete rule: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateChatbotRulesPriority(chatbotId: number, ruleIds: number[]) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await chatbotService.updateChatbotRulesPriority(chatbotId, ruleIds)
        // Update priority of rules in store
        ruleIds.forEach((ruleId, index) => {
          const rule = this.rules.find(r => r.id === ruleId)
          if (rule) {
            rule.priority = index + 1
          }
        })
        toast.success('Rule priorities updated successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to update rule priorities: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentChatbot(chatbot: Chatbot | null) {
      this.currentChatbot = chatbot
      if (!chatbot) {
        this.rules = []
        this.currentRule = null
      }
    },

    setCurrentRule(rule: ChatbotRule | null) {
      this.currentRule = rule
    },

    clearChatbots() {
      this.chatbots = []
      this.currentChatbot = null
      this.rules = []
      this.currentRule = null
    },

    clearRules() {
      this.rules = []
      this.currentRule = null
    },

    clearErrors() {
      this.error = null
    }
  }
}) 