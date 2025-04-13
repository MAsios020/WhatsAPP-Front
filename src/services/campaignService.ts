import axios from 'axios';
import { Campaign, CampaignStats, ApiResponse } from '@/types';

const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

class CampaignService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  async getCampaigns(page = 1, limit = 20, status?: string): Promise<{ campaigns: Campaign[], total: number }> {
    try {
      const response = await axios.get<ApiResponse<{ campaigns: Campaign[], total: number }>>(
        `${API_URL}/api/campaigns`,
        {
          params: { page, limit, status },
          headers: this.getAuthHeader()
        }
      );
      return response.data.data as { campaigns: Campaign[], total: number };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCampaign(id: number): Promise<Campaign> {
    try {
      const response = await axios.get<ApiResponse<Campaign>>(
        `${API_URL}/api/campaigns/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Campaign;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCampaign(
    campaignName: string,
    messageTemplateId: number,
    intervalTime: number
  ): Promise<Campaign> {
    try {
      const response = await axios.post<ApiResponse<Campaign>>(
        `${API_URL}/api/campaigns`,
        {
          campaign_name: campaignName,
          message_template_id: messageTemplateId,
          interval_time: intervalTime
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Campaign;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCampaign(
    id: number,
    campaignName: string,
    messageTemplateId: number,
    intervalTime: number
  ): Promise<Campaign> {
    try {
      const response = await axios.put<ApiResponse<Campaign>>(
        `${API_URL}/api/campaigns/${id}`,
        {
          campaign_name: campaignName,
          message_template_id: messageTemplateId,
          interval_time: intervalTime
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Campaign;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCampaign(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/campaigns/${id}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async startCampaign(id: number, contactIds: number[], instanceId: number): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/campaigns/${id}/start`,
        {
          contact_ids: contactIds,
          instance_id: instanceId
        },
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async pauseCampaign(id: number): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/campaigns/${id}/pause`,
        {},
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resumeCampaign(id: number): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/campaigns/${id}/resume`,
        {},
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async stopCampaign(id: number): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/campaigns/${id}/stop`,
        {},
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCampaignStats(): Promise<CampaignStats> {
    try {
      const response = await axios.get<ApiResponse<CampaignStats>>(
        `${API_URL}/api/campaigns/stats`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as CampaignStats;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCampaignContacts(id: number): Promise<number[]> {
    try {
      const response = await axios.get<ApiResponse<number[]>>(
        `${API_URL}/api/campaigns/${id}/contacts`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addContactsToCampaign(id: number, contactIds: number[]): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/campaigns/${id}/contacts`,
        { contact_ids: contactIds },
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeContactsFromCampaign(id: number, contactIds: number[]): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/api/campaigns/${id}/contacts`,
        {
          headers: this.getAuthHeader(),
          data: { contact_ids: contactIds }
        }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up request');
    }
  }
}

export default new CampaignService(); 