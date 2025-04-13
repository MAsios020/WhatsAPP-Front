import axios from 'axios';
import { Subscription, Package, Payment, ApiResponse } from '@/types';

const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

class SubscriptionService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    try {
      const response = await axios.get<ApiResponse<Package[]>>(
        `${API_URL}/api/packages`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPackage(id: number): Promise<Package> {
    try {
      const response = await axios.get<ApiResponse<Package>>(
        `${API_URL}/api/packages/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Package;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await axios.get<ApiResponse<Subscription[]>>(
        `${API_URL}/api/subscriptions`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await axios.get<ApiResponse<Subscription>>(
        `${API_URL}/api/subscriptions/current`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data || null;
    } catch (error) {
      // Return null if no active subscription
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async getSubscription(id: number): Promise<Subscription> {
    try {
      const response = await axios.get<ApiResponse<Subscription>>(
        `${API_URL}/api/subscriptions/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Subscription;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createSubscription(packageId: number): Promise<Subscription> {
    try {
      const response = await axios.post<ApiResponse<Subscription>>(
        `${API_URL}/api/subscriptions`,
        { package_id: packageId },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Subscription;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelSubscription(id: number): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/subscriptions/${id}/cancel`,
        {},
        { headers: this.getAuthHeader() }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async renewSubscription(id: number): Promise<Subscription> {
    try {
      const response = await axios.post<ApiResponse<Subscription>>(
        `${API_URL}/api/subscriptions/${id}/renew`,
        {},
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Subscription;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async upgradeSubscription(id: number, newPackageId: number): Promise<Subscription> {
    try {
      const response = await axios.post<ApiResponse<Subscription>>(
        `${API_URL}/api/subscriptions/${id}/upgrade`,
        { package_id: newPackageId },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Subscription;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Payments
  async getPayments(page = 1, limit = 20): Promise<{ payments: Payment[], total: number }> {
    try {
      const response = await axios.get<ApiResponse<{ payments: Payment[], total: number }>>(
        `${API_URL}/api/payments`,
        {
          params: { page, limit },
          headers: this.getAuthHeader()
        }
      );
      return response.data.data as { payments: Payment[], total: number };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPayment(id: number): Promise<Payment> {
    try {
      const response = await axios.get<ApiResponse<Payment>>(
        `${API_URL}/api/payments/${id}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Payment;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPayment(subscriptionId: number, amount: number, paymentMethod: string): Promise<Payment> {
    try {
      const response = await axios.post<ApiResponse<Payment>>(
        `${API_URL}/api/payments`,
        {
          subscription_id: subscriptionId,
          amount,
          payment_method: paymentMethod
        },
        { headers: this.getAuthHeader() }
      );
      return response.data.data as Payment;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubscriptionLimits(): Promise<{
    instances: { used: number; limit: number };
    contacts: { used: number; limit: number };
    messages: { used: number; limit: number };
  }> {
    try {
      const response = await axios.get<ApiResponse<{
        instances: { used: number; limit: number };
        contacts: { used: number; limit: number };
        messages: { used: number; limit: number };
      }>>(
        `${API_URL}/api/subscriptions/limits`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data as {
        instances: { used: number; limit: number };
        contacts: { used: number; limit: number };
        messages: { used: number; limit: number };
      };
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

export default new SubscriptionService(); 