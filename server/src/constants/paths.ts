import path from "path";

const DB_DIR = path.join(process.cwd(), "database");

export const DB_PATHS = {
  users: path.join(DB_DIR, "users.json"),
  basket: path.join(DB_DIR, "basket.json"),
  delivery: path.join(DB_DIR, "delivery.json"),
  products: path.join(DB_DIR, "products.json")
};
