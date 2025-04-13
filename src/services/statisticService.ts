import axios from 'axios'
import { DashboardStats, MessagesByStatus, InstancesByStatus, TopContacts } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class StatisticService {
  async getDashboardStats(period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${API_URL}/statistics/dashboard`, {
        params: { period },
        headers: this.getAuthHeader()
      })
      return response.data
    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  async getMessagesByStatus(period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<MessagesByStatus[]> {
    try {
      const response = await axios.get(`${API_URL}/statistics/messages`, {
        params: { period },
        headers: this.getAuthHeader()
      })
      return response.data
    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  async getInstancesByStatus(period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<InstancesByStatus[]> {
    try {
      const response = await axios.get(`${API_URL}/statistics/instances`, {
        params: { period },
        headers: this.getAuthHeader()
      })
      return response.data
    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  async getTopContacts(limit = 10, period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<TopContacts[]> {
    try {
      const response = await axios.get(`${API_URL}/statistics/contacts/top`, {
        params: { limit, period },
        headers: this.getAuthHeader()
      })
      return response.data
    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  private getAuthHeader() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user.token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private handleError(error: any) {
    if (error.response) {
      console.error('API Error Response:', error.response.data)
      if (error.response.status === 401) {
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } else if (error.request) {
      console.error('API Request Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
  }
}

export default new StatisticService() 