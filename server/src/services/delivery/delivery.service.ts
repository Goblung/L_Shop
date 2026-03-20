import { DB_PATHS } from "../../constants/paths";
import { readJsonFile, writeJsonFile } from "../file.service";

export type Delivery = {
  id: string;
  userId: string;
  address: string;
  phone: string;
  email: string;
  paymentMethod: "card" | "cash";
  status: "active" | "completed";
  createdAt: string;
};

export class DeliveryService {
  async getAll(): Promise<Delivery[]> {
    return readJsonFile<Delivery[]>(DB_PATHS.delivery, []);
  }

  async getActiveByUser(userId: string): Promise<Delivery[]> {
    const deliveries = await this.getAll();
    return deliveries.filter(
      (item) => item.userId === userId && item.status === "active"
    );
  }

  async create(input: {
    userId: string;
    address: string;
    phone: string;
    email: string;
    paymentMethod: "card" | "cash";
  }): Promise<Delivery> {
    const deliveries = await this.getAll();
    const nextDelivery: Delivery = {
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
    await writeJsonFile(DB_PATHS.delivery, deliveries);
    return nextDelivery;
  }
}
