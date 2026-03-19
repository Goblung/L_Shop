import type { ApiError, Basket, Delivery, Product, User } from "../types";

const API_BASE = "http://localhost:4000/api";

export interface RegisterPayload {
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface DeliveryPayload {
  address: string;
  phone: string;
  email: string;
  paymentMethod: "card" | "cash";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    let message = "Ошибка запроса";
    try {
      const payload = (await response.json()) as ApiError;
      message = payload.error ?? payload.message ?? message;
    } catch {
      // noop
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const api = {
  register: (payload: RegisterPayload) =>
    request<{ message: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: LoginPayload) =>
    request<{ message: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => request<User>("/auth/me"),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  products: (category: string) =>
    request<Product[]>(
      `/products${category === "all" ? "" : `?category=${encodeURIComponent(category)}`}`
    ),
  basket: () => request<Basket>("/basket/active"),
  addToBasket: (productId: string) =>
    request<Basket>("/basket/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity: 1 })
    }),
  deliveries: () => request<Delivery[]>("/delivery/active"),
  createDelivery: (payload: DeliveryPayload) =>
    request<Delivery>("/delivery", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
