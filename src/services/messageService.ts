import axios from 'axios';
import { Message, MessageTemplate, ApiResponse, MessageStats } from '@/types';

const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

class MessageService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  async sendMessage(instanceId: number, contactId: number, message: string): Promise<Message> {
    try {
      const response = await axios.post<ApiResponse<Message>>(
        `${API_URL}/api/messages/send`,
        {
          instance_id: instanceId,
          contact_id: contactId,
          message
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Message;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendBulkMessage(instanceId: number, contactIds: number[], message: string): Promise<{ 
    success: number; 
    failed: number; 
    messages: Message[] 
  }> {
    try {
      const response = await axios.post<ApiResponse<{ 
        success: number; 
        failed: number; 
        messages: Message[] 
      }>>(
        `${API_URL}/api/messages/send-bulk`,
        {
          instance_id: instanceId,
          contact_ids: contactIds,
          message
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as { 
        success: number; 
        failed: number; 
        messages: Message[] 
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessages(page = 1, limit = 20, status?: string): Promise<{ messages: Message[], total: number }> {
    try {
      const response = await axios.get<ApiResponse<{ messages: Message[], total: number }>>(
        `${API_URL}/api/messages`,
        {
          params: { page, limit, status },
          headers: this.getAuthHeader()
        }
      );
      return response.data.data as { messages: Message[], total: number };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessagesByInstance(instanceId: number, page = 1, limit = 20): Promise<{ messages: Message[], total: number }> {
    try {
      const response = await axios.get<ApiResponse<{ messages: Message[], total: number }>>(
        `${API_URL}/api/messages/instance/${instanceId}`,
        {
          params: { page, limit },
          headers: this.getAuthHeader()
        }
      );
      return response.data.data as { messages: Message[], total: number };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessagesByContact(contactId: number, page = 1, limit = 20): Promise<{ messages: Message[], total: number }> {
    try {
      const response = await axios.get<ApiResponse<{ messages: Message[], total: number }>>(
        `${API_URL}/api/messages/contact/${contactId}`,
        {
          params: { page, limit },
          headers: this.getAuthHeader()
        }
      );
      return response.data.data as { messages: Message[], total: number };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessageStatus(messageUid: string): Promise<string> {
    try {
      const response = await axios.get<ApiResponse<{ status: string }>>(
        `${API_URL}/api/messages/status/${messageUid}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data?.status || 'unknown';
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessageStats(timeframe?: string): Promise<MessageStats> {
    try {
      const response = await axios.get<ApiResponse<MessageStats>>(
        `${API_URL}/api/messages/stats`,
        {
          params: { timeframe },
          headers: this.getAuthHeader()
        }
      );
      return response.data.data as MessageStats;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Templates

  async getTemplates(): Promise<MessageTemplate[]> {
    try {
      const response = await axios.get<ApiResponse<MessageTemplate[]>>(
        `${API_URL}/api/message-templates`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTemplate(id: number): Promise<MessageTemplate> {
    try {
      const response = await axios.get<ApiResponse<MessageTemplate>>(
        `${API_URL}/api/message-templates/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as MessageTemplate;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTemplate(templateName: string, messageText: string): Promise<MessageTemplate> {
    try {
      const response = await axios.post<ApiResponse<MessageTemplate>>(
        `${API_URL}/api/message-templates`,
        {
          template_name: templateName,
          message_text: messageText
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as MessageTemplate;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTemplate(id: number, templateName: string, messageText: string): Promise<MessageTemplate> {
    try {
      const response = await axios.put<ApiResponse<MessageTemplate>>(
        `${API_URL}/api/message-templates/${id}`,
        {
          template_name: templateName,
          message_text: messageText
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as MessageTemplate;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTemplate(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/message-templates/${id}`, {
        headers: this.getAuthHeader()
      });
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

export default new MessageService(); 