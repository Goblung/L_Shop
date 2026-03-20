"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const paths_1 = require("../../constants/paths");
const file_service_1 = require("../file.service");
class DeliveryService {
    async getAll() {
        return (0, file_service_1.readJsonFile)(paths_1.DB_PATHS.delivery, []);
    }
    async getActiveByUser(userId) {
        const deliveries = await this.getAll();
        return deliveries.filter((item) => item.userId === userId && item.status === "active");
    }
    async create(input) {
        const deliveries = await this.getAll();
        const nextDelivery = {
            id: `d-${Date.now()}`,
            userId: input.userId,
            address: input.address,
            phone: input.phone,
            email: input.email,
            paymentMethod: input.paymentMethod,
            status: "active",
            createdAt: new Date().toISOString()
        };
        deliveries.push(nextDelivery);
        await (0, file_service_1.writeJsonFile)(paths_1.DB_PATHS.delivery, deliveries);
        return nextDelivery;
    }
}
exports.DeliveryService = DeliveryService;
