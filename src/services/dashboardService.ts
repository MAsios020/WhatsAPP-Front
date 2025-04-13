import axios from 'axios';
import { API_URL } from '@/config';
import authService from './authService';

export interface DashboardStats {
  totalAccounts: number;
  activeAccounts: number;
  pendingAccounts: number;
  blockedAccounts: number;
  totalMessages: number;
  totalCampaigns: number;
  successfulCampaigns: number;
  failedCampaigns: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
  }[];
}

class DashboardService {
  private async request(endpoint: string, method: string = 'GET', data?: any) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      };

      const response = await axios({
        url: `${API_URL}/${endpoint}`,
        method,
        headers,
        data
      });

      return response.data;
    } catch (error) {
      console.error(`Error in DashboardService.${endpoint}:`, error);
      throw error;
    }
  }

  async getStatistics(period: string = 'month') {
    return this.request(`dashboard/statistics?period=${period}`);
  }

  async getMessageActivity(period: string = 'month') {
    // For now, we'll return mock data until the API is ready
    return new Promise(resolve => {
      setTimeout(() => {
        const days = period === 'week' ? 7 : period === 'month' ? 30 : period === 'today' ? 1 : 365;
        const labels = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - i - 1));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const sent = Array.from({ length: days }, () => Math.floor(Math.random() * 1000));
        const delivered = sent.map(val => Math.floor(val * (0.8 + Math.random() * 0.2)));
        const read = delivered.map(val => Math.floor(val * (0.4 + Math.random() * 0.5)));

        resolve({
          labels,
          sent,
          delivered,
          read
        });
      }, 500);
    });
  }

  async getDeliveryStats(period: string = 'month') {
    // Mock data for delivery statistics
    return new Promise(resolve => {
      setTimeout(() => {
        const total = Math.floor(Math.random() * 10000) + 5000;
        const delivered = Math.floor(total * (0.7 + Math.random() * 0.2));
        const read = Math.floor(delivered * (0.5 + Math.random() * 0.4));
        const failed = Math.floor(total * (0.05 + Math.random() * 0.1));
        const pending = total - delivered - failed;

        resolve({
          total,
          delivered,
          read,
          failed,
          pending
        });
      }, 700);
    });
  }

  async getAccountsDistribution() {
    // Mock data for accounts distribution
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          labels: ['WhatsApp Business', 'WhatsApp API', 'Facebook Messenger', 'Instagram'],
          data: [
            Math.floor(Math.random() * 50) + 20,
            Math.floor(Math.random() * 30) + 40,
            Math.floor(Math.random() * 20) + 10,
            Math.floor(Math.random() * 15) + 5
          ]
        });
      }, 600);
    });
  }

  async getRecentCampaigns(limit: number = 5) {
    // Mock data for recent campaigns
    return new Promise(resolve => {
      setTimeout(() => {
        const campaigns = [];
        const campaignTypes = ['Promotional', 'Transactional', 'Newsletter', 'Event', 'Survey'];
        const statuses = ['Active', 'Completed', 'Scheduled', 'Draft'];
        
        for (let i = 0; i < limit; i++) {
          const deliveryRate = 0.7 + Math.random() * 0.29;
          const openRate = 0.4 + Math.random() * 0.5;
          
          campaigns.push({
            id: `campaign-${i + 1}`,
            name: `Campaign ${i + 1}`,
            type: campaignTypes[Math.floor(Math.random() * campaignTypes.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            sent: Math.floor(Math.random() * 5000) + 1000,
            delivered: 0,
            read: 0,
            deliveryRate,
            openRate,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
          });
        }
        
        // Calculate delivered and read based on rates
        campaigns.forEach(campaign => {
          campaign.delivered = Math.floor(campaign.sent * campaign.deliveryRate);
          campaign.read = Math.floor(campaign.delivered * campaign.openRate);
        });

        resolve(campaigns);
      }, 800);
    });
  }
}

export default new DashboardService(); 