"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const delivery_service_1 = require("../../services/delivery/delivery.service");
const basket_service_1 = require("../../services/basket/basket.service");
const deliveryService = new delivery_service_1.DeliveryService();
const basketService = new basket_service_1.BasketService();
class DeliveryController {
    async getActive(req, res) {
        if (!req.userId) {
            res.status(401).json({ error: "Не авторизован" });
            return;
        }
        const deliveries = await deliveryService.getActiveByUser(req.userId);
        res.json(deliveries);
    }
    async create(req, res) {
        if (!req.userId) {
            res.status(401).json({ error: "Не авторизован" });
            return;
        }
        const payload = req.body;
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
exports.DeliveryController = DeliveryController;
