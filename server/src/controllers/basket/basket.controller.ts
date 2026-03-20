import { Request, Response } from "express";
import { BasketService } from "../../services/basket/basket.service";
import { ProductsService } from "../../services/products/products.service";

const basketService = new BasketService();
const productsService = new ProductsService();

export class BasketController {
  async getActive(req: Request, res: Response): Promise<void> {
    if (!req.userId) {
      res.status(401).json({ error: "Не авторизован" });
      return;
    }

    const basket = await basketService.getActiveByUser(req.userId);
    res.json(basket);
  }

  async addItem(req: Request, res: Response): Promise<void> {
    if (!req.userId) {
      res.status(401).json({ error: "Не авторизован" });
      return;
    }

    const { productId, quantity } = req.body as { productId?: string; quantity?: number };
    if (!productId) {
      res.status(400).json({ error: "productId обязателен" });
      return;
    }

    const product = await productsService.getById(productId);
    if (!product) {
      res.status(404).json({ error: "Товар не найден" });
      return;
    }

    const basket = await basketService.addItem(req.userId, {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity
    });
    res.status(201).json(basket);
  }
}
