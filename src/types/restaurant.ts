export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
}

export interface CartItem extends Dish {
  quantity: number;
}

export interface Order {
  items: CartItem[];
  total: number;
  customerInfo?: {
    name: string;
    phone: string;
    address: string;
  };
}
