import type { ApiError, Basket, Delivery, User } from "../types";
import type { Product } from "../types/product";

const API_BASE = "http://localhost:4000/api";
const IMAGES_BASE = API_BASE.replace(/\/api\/?$/, "");

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
  basket: () => request<Basket>("/basket/active"),
  addToBasket: (productId: string, quantity: number) =>
    request<Basket>("/basket/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity })
    }),
  updateBasketItem: (productId: string, quantity: number) =>
    request<Basket>(`/basket/items/${encodeURIComponent(productId)}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity })
    }),
  removeBasketItem: (productId: string) =>
    request<Basket>(`/basket/items/${encodeURIComponent(productId)}`, {
      method: "DELETE"
    }),
  clearBasket: () => request<Basket>("/basket/clear", { method: "DELETE" }),
  products: async (): Promise<Product[]> => {
    const rawProducts = await request<unknown[]>("/products");
    return rawProducts.map((raw) => {
      const p = raw as any;
      const preview =
        typeof p.images?.preview === "string" ? (p.images.preview as string) : undefined;

      const normalizedImages =
        p.images && typeof p.images === "object"
          ? {
              ...p.images,
              preview:
                preview && preview.startsWith("/img/")
                  ? `${IMAGES_BASE}${preview}`
                  : preview ?? p.images.preview
            }
          : p.images;

      return {
        ...p,
        id: p.id as number | string,
        images: normalizedImages,
        delivery: p.delivery
          ? {
              ...p.delivery,
              earlyDate: new Date(p.delivery.earlyDate)
            }
          : undefined
      } as Product;
    });
  },
  deliveries: () => request<Delivery[]>("/delivery/active"),
  createDelivery: (payload: DeliveryPayload) =>
    request<Delivery>("/delivery", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
