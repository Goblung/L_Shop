import { Request, Response } from "express";
import { DeliveryService } from "../../services/delivery/delivery.service";
import { BasketService } from "../../services/basket/basket.service";

const deliveryService = new DeliveryService();
const basketService = new BasketService();

export class DeliveryController {
  async getActive(req: Request, res: Response): Promise<void> {
    if (!req.userId) {
      res.status(401).json({ error: "Не авторизован" });
      return;
    }

    const deliveries = await deliveryService.getActiveByUser(req.userId);
    res.json(deliveries);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!req.userId) {
      res.status(401).json({ error: "Не авторизован" });
      return;
    }

    const payload = req.body as {
      address?: string;
      phone?: string;
      email?: string;
      paymentMethod?: "card" | "cash";
    };

    if (!payload.address || !payload.phone || !payload.email || !payload.paymentMethod) {
      res.status(400).json({ error: "Заполните форму доставки" });
      return;
    }

    const basket = await basketService.getActiveByUser(req.userId);
    if (basket.items.length === 0) {
      res.status(400).json({ error: "Корзина пуста" });
      return;
    }

    const delivery = await deliveryService.create({
      userId: req.userId,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
      paymentMethod: payload.paymentMethod
    });
    await basketService.clear(req.userId);
    res.status(201).json(delivery);
  }
}
