"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketService = void 0;
const paths_1 = require("../../constants/paths");
const file_service_1 = require("../file.service");
class BasketService {
    async getAll() {
        return (0, file_service_1.readJsonFile)(paths_1.DB_PATHS.basket, []);
    }
    async getActiveByUser(userId) {
        const baskets = await this.getAll();
        let basket = baskets.find((item) => item.userId === userId && item.active);
        if (!basket) {
            basket = this.buildDefaultBasket(userId);
            baskets.push(basket);
            await (0, file_service_1.writeJsonFile)(paths_1.DB_PATHS.basket, baskets);
        }
        return basket;
    }
    async addItem(userId, item) {
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
        }
        else {
            basket.items.push({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: nextQuantity
            });
        }
        basket.updatedAt = new Date().toISOString();
        await (0, file_service_1.writeJsonFile)(paths_1.DB_PATHS.basket, baskets);
        return basket;
    }
    async clear(userId) {
        const baskets = await this.getAll();
        let basket = baskets.find((entry) => entry.userId === userId && entry.active);
        if (!basket) {
            basket = this.buildDefaultBasket(userId);
            baskets.push(basket);
        }
        basket.items = [];
        basket.updatedAt = new Date().toISOString();
        await (0, file_service_1.writeJsonFile)(paths_1.DB_PATHS.basket, baskets);
        return basket;
    }
    buildDefaultBasket(userId) {
        return {
            userId,
            active: true,
            items: [],
            updatedAt: new Date().toISOString()
        };
    }
}
exports.BasketService = BasketService;
