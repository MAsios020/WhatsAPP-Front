import axios from 'axios';
import { Chatbot, ChatbotRule, ApiResponse } from '@/types';

const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

class ChatbotService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // Chatbot methods
  async getChatbots(): Promise<Chatbot[]> {
    try {
      const response = await axios.get<ApiResponse<Chatbot[]>>(
        `${API_URL}/api/chatbots`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChatbot(id: number): Promise<Chatbot> {
    try {
      const response = await axios.get<ApiResponse<Chatbot>>(
        `${API_URL}/api/chatbots/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Chatbot;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChatbotByInstance(instanceId: number): Promise<Chatbot | null> {
    try {
      const response = await axios.get<ApiResponse<Chatbot>>(
        `${API_URL}/api/chatbots/instance/${instanceId}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || null;
    } catch (error) {
      // Return null if no chatbot found
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async createChatbot(instanceId: number, chatbotName: string): Promise<Chatbot> {
    try {
      const response = await axios.post<ApiResponse<Chatbot>>(
        `${API_URL}/api/chatbots`,
        {
          instance_id: instanceId,
          chatbot_name: chatbotName
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Chatbot;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateChatbot(id: number, chatbotName: string, isActive: boolean): Promise<Chatbot> {
    try {
      const response = await axios.put<ApiResponse<Chatbot>>(
        `${API_URL}/api/chatbots/${id}`,
        {
          chatbot_name: chatbotName,
          is_active: isActive
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Chatbot;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteChatbot(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/chatbots/${id}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async toggleChatbotActive(id: number, isActive: boolean): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/chatbots/${id}/toggle`,
        { is_active: isActive },
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Chatbot Rule methods
  async getChatbotRules(chatbotId: number): Promise<ChatbotRule[]> {
    try {
      const response = await axios.get<ApiResponse<ChatbotRule[]>>(
        `${API_URL}/api/chatbots/${chatbotId}/rules`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChatbotRule(chatbotId: number, ruleId: number): Promise<ChatbotRule> {
    try {
      const response = await axios.get<ApiResponse<ChatbotRule>>(
        `${API_URL}/api/chatbots/${chatbotId}/rules/${ruleId}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as ChatbotRule;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createChatbotRule(
    chatbotId: number,
    ruleName: string,
    keyword: string,
    response: string,
    matchType: 'exact' | 'contains' | 'starts_with' | 'ends_with' | 'regex',
    caseSensitive: boolean,
    priority: number
  ): Promise<ChatbotRule> {
    try {
      const response = await axios.post<ApiResponse<ChatbotRule>>(
        `${API_URL}/api/chatbots/${chatbotId}/rules`,
        {
          rule_name: ruleName,
          keyword,
          response,
          match_type: matchType,
          case_sensitive: caseSensitive,
          priority
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as ChatbotRule;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateChatbotRule(
    chatbotId: number,
    ruleId: number,
    ruleName: string,
    keyword: string,
    response: string,
    matchType: 'exact' | 'contains' | 'starts_with' | 'ends_with' | 'regex',
    caseSensitive: boolean,
    priority: number
  ): Promise<ChatbotRule> {
    try {
      const response = await axios.put<ApiResponse<ChatbotRule>>(
        `${API_URL}/api/chatbots/${chatbotId}/rules/${ruleId}`,
        {
          rule_name: ruleName,
          keyword,
          response,
          match_type: matchType,
          case_sensitive: caseSensitive,
          priority
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as ChatbotRule;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteChatbotRule(chatbotId: number, ruleId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/chatbots/${chatbotId}/rules/${ruleId}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateChatbotRulesPriority(chatbotId: number, ruleIds: number[]): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/api/chatbots/${chatbotId}/rules/priority`,
        { rule_ids: ruleIds },
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

export default new ChatbotService(); 