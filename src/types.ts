export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  city?: string;
  pincode?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GroceryItem {
  id: string;
  orderId?: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export type OrderSource = 'Manual Entry' | 'Image Upload';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  mobile: string;
  email?: string;
  address: string;
  city?: string;
  pincode?: string;
  orderDate: string;
  totalItems: number;
  source: OrderSource;
  status: OrderStatus;
  items: GroceryItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface Feedback {
  id: string;
  customerName: string;
  mobile: string;
  orderNumber?: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: string;
}

export interface AdminStats {
  totalCustomers: number;
  totalOrders: number;
  todayOrders: number;
  totalGroceryItems: number;
  pendingOrders: number;
  completedOrders: number;
  avgRating: number;
}

export interface ExtractedGroceryItem {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface OCRResponse {
  success: boolean;
  source: string;
  items: ExtractedGroceryItem[];
  rawText?: string;
  message?: string;
}
