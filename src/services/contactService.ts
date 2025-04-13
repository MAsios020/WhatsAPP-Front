import axios from 'axios';
import { Contact, Category, ContactStats, ApiResponse } from '@/types';

const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

class ContactService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // Contact methods
  async getContacts(page = 1, limit = 20, categoryId?: number): Promise<{ contacts: Contact[], total: number }> {
    try {
      const response = await axios.get<ApiResponse<{ contacts: Contact[], total: number }>>(
        `${API_URL}/api/contacts`,
        {
          params: { page, limit, category_id: categoryId },
          headers: this.getAuthHeader()
        }
      );
      return response.data.data as { contacts: Contact[], total: number };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContact(id: number): Promise<Contact> {
    try {
      const response = await axios.get<ApiResponse<Contact>>(
        `${API_URL}/api/contacts/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Contact;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createContact(name: string, phoneNumber: string, categoryId: number): Promise<Contact> {
    try {
      const response = await axios.post<ApiResponse<Contact>>(
        `${API_URL}/api/contacts`,
        {
          name,
          phone_number: phoneNumber,
          category_id: categoryId
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Contact;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateContact(id: number, name: string, phoneNumber: string, categoryId: number): Promise<Contact> {
    try {
      const response = await axios.put<ApiResponse<Contact>>(
        `${API_URL}/api/contacts/${id}`,
        {
          name,
          phone_number: phoneNumber,
          category_id: categoryId
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Contact;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteContact(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/contacts/${id}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async importContacts(file: File, categoryId: number): Promise<{ imported: number, failed: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category_id', categoryId.toString());

      const response = await axios.post<ApiResponse<{ imported: number, failed: number }>>(
        `${API_URL}/api/contacts/import`,
        formData,
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data as { imported: number, failed: number };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportContacts(categoryId?: number): Promise<string> {
    try {
      const response = await axios.get<Blob>(
        `${API_URL}/api/contacts/export`,
        {
          params: { category_id: categoryId },
          headers: this.getAuthHeader(),
          responseType: 'blob'
        }
      );
      
      // Create blob link for download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return url;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContactStats(): Promise<ContactStats> {
    try {
      const response = await axios.get<ApiResponse<ContactStats>>(
        `${API_URL}/api/contacts/stats`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as ContactStats;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<ApiResponse<Category[]>>(
        `${API_URL}/api/categories`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategory(id: number): Promise<Category> {
    try {
      const response = await axios.get<ApiResponse<Category>>(
        `${API_URL}/api/categories/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Category;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCategory(categoryName: string): Promise<Category> {
    try {
      const response = await axios.post<ApiResponse<Category>>(
        `${API_URL}/api/categories`,
        { category_name: categoryName },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Category;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCategory(id: number, categoryName: string): Promise<Category> {
    try {
      const response = await axios.put<ApiResponse<Category>>(
        `${API_URL}/api/categories/${id}`,
        { category_name: categoryName },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Category;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`, {
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

export default new ContactService(); 