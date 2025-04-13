import { defineStore } from 'pinia'
import contactService from '@/services/contactService'
import { Contact, Category, ContactStats } from '@/types'
import { useToast } from 'vue-toastification'

export const useContactStore = defineStore('contact', {
  state: () => ({
    contacts: [] as Contact[],
    categories: [] as Category[],
    selectedCategory: null as number | null,
    currentContact: null as Contact | null,
    loading: false,
    error: null as string | null,
    totalContacts: 0,
    contactStats: null as ContactStats | null
  }),

  getters: {
    contactsByCategory: (state) => {
      if (state.selectedCategory === null) {
        return state.contacts
      }
      return state.contacts.filter(contact => contact.category_id === state.selectedCategory)
    }
  },

  actions: {
    // Contact actions
    async fetchContacts(page = 1, limit = 20, categoryId?: number) {
      this.loading = true
      this.error = null

      try {
        const result = await contactService.getContacts(page, limit, categoryId)
        this.contacts = result.contacts
        this.totalContacts = result.total
        if (categoryId !== undefined) {
          this.selectedCategory = categoryId
        }
        return result
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchContact(id: number) {
      this.loading = true
      this.error = null

      try {
        const contact = await contactService.getContact(id)
        // Update in the contacts array if it exists
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts[index] = contact
        } else {
          this.contacts.push(contact)
        }
        this.currentContact = contact
        return contact
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createContact(name: string, phoneNumber: string, categoryId: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const contact = await contactService.createContact(name, phoneNumber, categoryId)
        this.contacts.push(contact)
        toast.success('Contact created successfully')
        return contact
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create contact: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateContact(id: number, name: string, phoneNumber: string, categoryId: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const contact = await contactService.updateContact(id, name, phoneNumber, categoryId)
        // Update in the contacts array
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts[index] = contact
        }
        if (this.currentContact && this.currentContact.id === id) {
          this.currentContact = contact
        }
        toast.success('Contact updated successfully')
        return contact
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to update contact: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteContact(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await contactService.deleteContact(id)
        this.contacts = this.contacts.filter(contact => contact.id !== id)
        if (this.currentContact && this.currentContact.id === id) {
          this.currentContact = null
        }
        toast.success('Contact deleted successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to delete contact: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async importContacts(file: File, categoryId: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const result = await contactService.importContacts(file, categoryId)
        toast.success(`Imported ${result.imported} contacts. Failed: ${result.failed}`)
        // Refresh contacts after import
        await this.fetchContacts(1, 20, categoryId)
        return result
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to import contacts: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async exportContacts(categoryId?: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await contactService.exportContacts(categoryId)
        toast.success('Contacts exported successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to export contacts: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchContactStats() {
      this.loading = true
      this.error = null

      try {
        const stats = await contactService.getContactStats()
        this.contactStats = stats
        return stats
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Category actions
    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        const categories = await contactService.getCategories()
        this.categories = categories
        return categories
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCategory(categoryName: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const category = await contactService.createCategory(categoryName)
        this.categories.push(category)
        toast.success('Category created successfully')
        return category
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to create category: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id: number, categoryName: string) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        const category = await contactService.updateCategory(id, categoryName)
        // Update in the categories array
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = category
        }
        toast.success('Category updated successfully')
        return category
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to update category: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id: number) {
      this.loading = true
      this.error = null
      const toast = useToast()

      try {
        await contactService.deleteCategory(id)
        this.categories = this.categories.filter(category => category.id !== id)
        if (this.selectedCategory === id) {
          this.selectedCategory = null
        }
        toast.success('Category deleted successfully')
      } catch (error: any) {
        this.error = error.message
        toast.error(`Failed to delete category: ${error.message}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedCategory(categoryId: number | null) {
      this.selectedCategory = categoryId
    },

    setCurrentContact(contact: Contact | null) {
      this.currentContact = contact
    },

    clearContacts() {
      this.contacts = []
      this.currentContact = null
    },

    clearCategories() {
      this.categories = []
      this.selectedCategory = null
    },

    clearErrors() {
      this.error = null
    }
  }
}) 