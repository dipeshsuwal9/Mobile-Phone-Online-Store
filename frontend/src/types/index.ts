// Type definitions for the application

export interface User {
  customer_id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface Brand {
  brand_id: number;
  brand_name: string;
  country_of_origin?: string;
  website?: string;
  logo?: string;
}

export interface MobilePhone {
  phone_id: number;
  brand: number;
  brand_name?: string;
  model_name: string;
  price: string;
  stock_quantity: number;
  ram: string;
  storage: string;
  battery_capacity: string;
  processor: string;
  operating_system: string;
  screen_size?: string;
  camera_specs?: string;
  color?: string;
  image_url?: string;
  image?: string;
  image_display?: string;
  description?: string;
  created_at?: string;
}

export interface Accessory {
  accessory_id: number;
  name: string; // Fixed: was accessory_name
  category: string; // Fixed: was accessory_type
  price: string;
  stock_quantity: number;
  description?: string;
  image_url?: string;
  image?: string;
  image_display?: string;
  is_in_stock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  cart_item_id: number;
  product_type: "PHONE" | "ACCESSORY";
  product_id: number;
  quantity: number;
  product_name?: string;
  unit_price?: string;
  subtotal?: string;
  product?: MobilePhone | Accessory;
}

export interface Cart {
  cart_id: number;
  customer: number;
  items: CartItem[];
  total_items?: number;
  total_amount?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  order_item_id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
  subtotal?: string;
}

export interface Order {
  order_id: number;
  customer: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total_amount: string;
  shipping_address: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  payment_id: number;
  order: number;
  amount: string;
  payment_method:
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "UPI"
    | "NET_BANKING"
    | "CASH_ON_DELIVERY";
  payment_status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  transaction_id?: string;
  created_at: string;
}

export interface ApiError {
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
