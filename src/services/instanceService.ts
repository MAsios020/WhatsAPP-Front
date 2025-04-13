import axios from 'axios';
import { Instance, ApiResponse } from '@/types';

const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

class InstanceService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  async getAllInstances(): Promise<Instance[]> {
    try {
      const response = await axios.get<ApiResponse<Instance[]>>(`${API_URL}/api/instances`, {
        headers: this.getAuthHeader()
      });
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getInstance(id: number): Promise<Instance> {
    try {
      const response = await axios.get<ApiResponse<Instance>>(`${API_URL}/api/instances/${id}`, {
        headers: this.getAuthHeader()
      });
      return response.data.data as Instance;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createInstance(instanceName: string): Promise<Instance> {
    try {
      const response = await axios.post<ApiResponse<Instance>>(
        `${API_URL}/api/instances`,
        { instance_name: instanceName },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Instance;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteInstance(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/instances/${id}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getQRCode(id: number): Promise<string> {
    try {
      const response = await axios.get<ApiResponse<{ qr_code: string }>>(
        `${API_URL}/api/instances/${id}/qr-code`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data?.qr_code || '';
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshQRCode(id: number): Promise<string> {
    try {
      const response = await axios.post<ApiResponse<{ qr_code: string }>>(
        `${API_URL}/api/instances/${id}/refresh-qr`,
        {},
        { headers: this.getAuthHeader() }
      );
      return response.data.data?.qr_code || '';
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async disconnectInstance(id: number): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/instances/${id}/disconnect`,
        {},
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async reconnectInstance(id: number): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/instances/${id}/reconnect`,
        {},
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async toggleChatbot(id: number, isActive: boolean): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/instances/${id}/toggle-chatbot`,
        { is_active: isActive },
        { headers: this.getAuthHeader() }
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

export default new InstanceService(); 