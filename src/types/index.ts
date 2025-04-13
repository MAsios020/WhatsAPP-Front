// Core database schema interfaces for WhatsApp Sender

export interface Client {
  id: number;
  accountName: string;
  email: string;
  password_hash?: string;
  created_at: Date;
}

export interface Instance {
  id: number;
  client_id: number;
  instance_name: string;
  status: 'connected' | 'disconnected' | 'initializing';
  is_chatbot_active: boolean;
  qr_code?: string;
  created_at: Date;
}

export interface Contact {
  id: number;
  client_id: number;
  category_id: number;
  phone_number: string;
  name: string;
  created_at: Date;
}

export interface Category {
  id: number;
  client_id: number;
  category_name: string;
  created_at: Date;
}

export interface MessageTemplate {
  id: number;
  client_id: number;
  template_name: string;
  message_text: string;
  created_at: Date;
}

export interface Message {
  id: number;
  instance_id: number;
  contact_id: number;
  message_uid: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at: Date;
}

export interface Campaign {
  id: number;
  client_id: number;
  campaign_name: string;
  message_template_id: number;
  interval_time: number;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  created_at: Date;
}

export interface Subscription {
  id: number;
  client_id: number;
  package_id: number;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'expired' | 'cancelled';
  created_at: Date;
}

export interface Package {
  id: number;
  package_name: string;
  price: number;
  duration: number; // in days
  max_instances: number;
  max_contacts: number;
  max_messages: number;
  features: string[];
}

export interface Payment {
  id: number;
  subscription_id: number;
  amount: number;
  payment_date: Date;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id: string;
}

export interface Chatbot {
  id: number;
  instance_id: number;
  chatbot_name: string;
  is_active: boolean;
  created_at: Date;
}

export interface ChatbotRule {
  id: number;
  chatbot_id: number;
  rule_name: string;
  keyword: string;
  response: string;
  match_type: 'exact' | 'contains' | 'starts_with' | 'ends_with' | 'regex';
  case_sensitive: boolean;
  priority: number;
  created_at: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Statistics types for dashboard
export interface InstanceStats {
  total: number;
  connected: number;
  disconnected: number;
}

export interface MessageStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface ContactStats {
  total: number;
  byCategory: {
    categoryId: number;
    categoryName: string;
    count: number;
  }[];
}

export interface CampaignStats {
  total: number;
  running: number;
  scheduled: number;
  completed: number;
  draft: number;
}

export interface DashboardStats {
  instances: InstanceStats;
  messages: MessageStats;
  contacts: ContactStats;
  campaigns: CampaignStats;
  subscription?: {
    package: string;
    expiresIn: number; // Days remaining
    messagesRemaining: number;
  };
}

export interface MessagesByStatus {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface InstancesByStatus {
  instanceName: string;
  status: 'connected' | 'disconnected' | 'initializing';
  lastActive: string;
  messagesCount: number;
}

export interface TopContacts {
  id: number;
  name: string;
  phoneNumber: string;
  messageCount: number;
  lastMessageDate: string;
  category: string;
}

export interface DailyMessageStats {
  date: string;
  count: number;
}

export interface DetailedDashboardStats extends DashboardStats {
  messagesByStatus: MessagesByStatus[];
  instancesByStatus: InstancesByStatus[];
  topContacts: TopContacts[];
  dailyMessages: DailyMessageStats[];
  messagesPerHour: { hour: number; count: number }[];
} 