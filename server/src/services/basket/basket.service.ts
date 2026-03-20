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
      items: [
        { productId: "p1", name: "Молоко 1л", price: 120, quantity: 2 },
        { productId: "p2", name: "Хлеб цельнозерновой", price: 75, quantity: 1 }
      ],
      updatedAt: new Date().toISOString()
    };
  }
}
