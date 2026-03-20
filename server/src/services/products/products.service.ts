import { DB_PATHS } from "../../constants/paths";
import { readJsonFile } from "../file.service";

export type Address = {
  country?: string;
  town?: string;
  street?: string;
  houseNumber?: string;
};

export type Product = {
  id: string | number;
  title: string;
  price: number;
  isAvailable: boolean;
  description: string;
  categories: string[];
  images: {
    preview: string;
    gallery?: string[];
  };
  delivery?: {
    startTown: Address;
    earlyDate: string; // хранится в JSON как строка (ISO)
    price: number;
  };
  discount?: number; // скидка в процентах
};

export class ProductsService {
  async getAll(category?: string): Promise<Product[]> {
    const products = await readJsonFile<Product[]>(DB_PATHS.products, []);
    if (!category || category === "all") return products;
    return products.filter((product) => product.categories.includes(category));
  }

  async getById(productId: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((product) => product.id.toString() === productId) ?? null;
  }
}
