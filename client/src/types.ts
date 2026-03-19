export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  login: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface BasketItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Basket {
  userId: string;
  active: boolean;
  items: BasketItem[];
  updatedAt: string;
}

export interface Delivery {
  id: string;
  userId: string;
  address: string;
  phone: string;
  email: string;
  paymentMethod: "card" | "cash";
  status: "active" | "completed";
  createdAt: string;
}

export interface ApiError {
  error?: string;
  message?: string;
}
