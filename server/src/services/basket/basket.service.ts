import { DB_PATHS } from "../../constants/paths";
import { readJsonFile, writeJsonFile } from "../file.service";

export type BasketItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Basket = {
  userId: string;
  active: boolean;
  items: BasketItem[];
  updatedAt: string;
};

export class BasketService {
  async getAll(): Promise<Basket[]> {
    return readJsonFile<Basket[]>(DB_PATHS.basket, []);
  }

  async getActiveByUser(userId: string): Promise<Basket> {
    const baskets = await this.getAll();
    let basket = baskets.find((item) => item.userId === userId && item.active);

    if (!basket) {
      basket = this.buildDefaultBasket(userId);
      baskets.push(basket);
      await writeJsonFile(DB_PATHS.basket, baskets);
    }

    return basket;
  }

  async addItem(
    userId: string,
    item: { productId: string; name: string; price: number; quantity?: number }
  ): Promise<Basket> {
    const baskets = await this.getAll();
    let basket = baskets.find((entry) => entry.userId === userId && entry.active);

    if (!basket) {
      basket = this.buildDefaultBasket(userId);
      basket.items = [];
      baskets.push(basket);
    }

    const existing = basket.items.find((entry) => entry.productId === item.productId);
    const nextQuantity = item.quantity ?? 1;
    if (existing) {
      existing.quantity += nextQuantity;
    } else {
      basket.items.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: nextQuantity
      });
    }
    basket.updatedAt = new Date().toISOString();
    await writeJsonFile(DB_PATHS.basket, baskets);
    return basket;
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<Basket | null> {
    if (!Number.isFinite(quantity) || quantity < 1) {
      return null;
    }

    const baskets = await this.getAll();
    const basket = baskets.find((entry) => entry.userId === userId && entry.active);
    if (!basket) {
      return null;
    }

    const item = basket.items.find((entry) => entry.productId === productId);
    if (!item) {
      return null;
    }

    item.quantity = Math.floor(quantity);
    basket.updatedAt = new Date().toISOString();
    await writeJsonFile(DB_PATHS.basket, baskets);
    return basket;
  }

  async removeItem(userId: string, productId: string): Promise<Basket | null> {
    const baskets = await this.getAll();
    const basket = baskets.find((entry) => entry.userId === userId && entry.active);
    if (!basket) {
      return null;
    }

    const nextItems = basket.items.filter((entry) => entry.productId !== productId);
    if (nextItems.length === basket.items.length) {
      return null;
    }

    basket.items = nextItems;
    basket.updatedAt = new Date().toISOString();
    await writeJsonFile(DB_PATHS.basket, baskets);
    return basket;
  }

  async clear(userId: string): Promise<Basket> {
    const baskets = await this.getAll();
    let basket = baskets.find((entry) => entry.userId === userId && entry.active);
    if (!basket) {
      basket = this.buildDefaultBasket(userId);
      baskets.push(basket);
    }
    basket.items = [];
    basket.updatedAt = new Date().toISOString();
    await writeJsonFile(DB_PATHS.basket, baskets);
    return basket;
  }

  private buildDefaultBasket(userId: string): Basket {
    return {
      userId,
      active: true,
      items: [],
      updatedAt: new Date().toISOString()
    };
  }
}
