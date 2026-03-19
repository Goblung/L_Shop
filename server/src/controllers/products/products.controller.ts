import { Request, Response } from "express";
import { ProductsService } from "../../services/products/products.service";

const productsService = new ProductsService();

export class ProductsController {
  async list(req: Request, res: Response): Promise<void> {
    const rawCategory = req.query.category;
    const category = typeof rawCategory === "string" ? rawCategory : undefined;
    const products = await productsService.getAll(category);
    res.json(products);
  }
}
