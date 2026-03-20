"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const products_service_1 = require("../../services/products/products.service");
const productsService = new products_service_1.ProductsService();
class ProductsController {
    async list(req, res) {
        const rawCategory = req.query.category;
        const category = typeof rawCategory === "string" ? rawCategory : undefined;
        const products = await productsService.getAll(category);
        res.json(products);
    }
}
exports.ProductsController = ProductsController;
