import { Dish, CartItem } from '@/types/restaurant';

const API_BASE = {
  GET_MENU: 'https://functions.poehali.dev/9f6e51f9-0e03-4a02-be62-73cc026c8c6e',
  CREATE_ORDER: 'https://functions.poehali.dev/1add3bb7-0b10-47d4-9cc9-0dc3c8040250',
  GET_ORDER: 'https://functions.poehali.dev/1018dbd4-c305-4042-8dfa-c3b9d7f36aad',
};

export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  message: string;
}

export interface OrderDetails {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    dishId: string;
    dishName: string;
    quantity: number;
    price: number;
  }>;
}

export const api = {
  async getMenu(category?: string): Promise<Dish[]> {
    const url = category 
      ? `${API_BASE.GET_MENU}?category=${encodeURIComponent(category)}`
      : API_BASE.GET_MENU;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch menu');
    
    const data = await response.json();
    return data.dishes;
  },

  async createOrder(order: OrderRequest): Promise<OrderResponse> {
    const response = await fetch(API_BASE.CREATE_ORDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    
    if (!response.ok) throw new Error('Failed to create order');
    
    return response.json();
  },

  async getOrder(orderId: number): Promise<OrderDetails> {
    const response = await fetch(`${API_BASE.GET_ORDER}?orderId=${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    
    const data = await response.json();
    return data.order;
  },
};
