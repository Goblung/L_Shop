import { DB_PATHS } from "../../constants/paths";
import { readJsonFile } from "../file.service";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};

export class ProductsService {
  async getAll(category?: string): Promise<Product[]> {
    const products = await readJsonFile<Product[]>(DB_PATHS.products, []);
    if (!category || category === "all") {
      return products;
    }
    return products.filter((product) => product.category === category);
  }

  async getById(productId: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((product) => product.id === productId) ?? null;
  }
}
