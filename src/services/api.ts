import { Customer, Order, Feedback, AdminStats, OCRResponse } from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async adminLogin(password: string, username = 'admin') {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async getCustomers(): Promise<Customer[]> {
    const res = await fetch('/api/customers/');
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  async getOrders(params?: { search?: string; status?: string; mobile?: string; customerId?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.mobile) query.set('mobile', params.mobile);
    if (params?.customerId) query.set('customerId', params.customerId);

    const res = await fetch(`/api/orders/?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async createOrder(data: {
    customer: {
      name: string;
      mobile: string;
      email?: string;
      address: string;
      city?: string;
      pincode?: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      unit: string;
      notes?: string;
    }>;
    source: 'Manual Entry' | 'Image Upload';
  }): Promise<Order> {
    const res = await fetch('/api/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Submission failed' }));
      throw new Error(err.error || 'Failed to submit grocery list');
    }
    return res.json();
  },

  async extractOCR(image: string, mimeType = 'image/jpeg'): Promise<OCRResponse> {
    const res = await fetch('/api/ocr/extract/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, mimeType }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'OCR extraction failed' }));
      throw new Error(err.error || 'Failed to extract items from image');
    }
    return res.json();
  },

  async submitFeedback(data: {
    customerName: string;
    mobile: string;
    orderNumber?: string;
    rating: number;
    feedback: string;
  }): Promise<Feedback> {
    const res = await fetch('/api/feedback/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit feedback' }));
      throw new Error(err.error || 'Failed to submit feedback');
    }
    return res.json();
  },

  async getFeedback(): Promise<Feedback[]> {
    const res = await fetch('/api/feedback/');
    if (!res.ok) throw new Error('Failed to fetch feedback');
    return res.json();
  },

  getExcelDownloadUrl(filter?: string, customerId?: string, from?: string, to?: string) {
    const query = new URLSearchParams();
    if (filter) query.set('filter', filter);
    if (customerId) query.set('customerId', customerId);
    if (from && to) {
      query.set('from', from);
      query.set('to', to);
    }
    return `/api/reports/excel/?${query.toString()}`;
  },
};
