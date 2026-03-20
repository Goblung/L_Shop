"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketController = void 0;
const basket_service_1 = require("../../services/basket/basket.service");
const products_service_1 = require("../../services/products/products.service");
const basketService = new basket_service_1.BasketService();
const productsService = new products_service_1.ProductsService();
class BasketController {
    async getActive(req, res) {
        if (!req.userId) {
            res.status(401).json({ error: "Не авторизован" });
            return;
        }
        const basket = await basketService.getActiveByUser(req.userId);
        res.json(basket);
    }
    async addItem(req, res) {
        if (!req.userId) {
            res.status(401).json({ error: "Не авторизован" });
            return;
        }
        const { productId, quantity } = req.body;
        if (!productId) {
            res.status(400).json({ error: "productId обязателен" });
            return;
        }
        const product = await productsService.getById(productId);
        if (!product) {
            res.status(404).json({ error: "Товар не найден" });
            return;
        }
        const finalPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;
        const basket = await basketService.addItem(req.userId, {
            productId: String(product.id),
            name: product.title,
            price: finalPrice,
            quantity
        });
        res.status(201).json(basket);
    }
}
exports.BasketController = BasketController;
