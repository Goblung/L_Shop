"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const paths_1 = require("../../constants/paths");
const file_service_1 = require("../file.service");
class ProductsService {
    async getAll(category) {
        const products = await (0, file_service_1.readJsonFile)(paths_1.DB_PATHS.products, []);
        if (!category || category === "all")
            return products;
        return products.filter((product) => product.categories.includes(category));
    }
    async getById(productId) {
        const products = await this.getAll();
        return products.find((product) => product.id.toString() === productId) ?? null;
    }
}
exports.ProductsService = ProductsService;
