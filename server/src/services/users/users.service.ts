import crypto from "crypto";
import { DB_PATHS } from "../../constants/paths";
import { readJsonFile, writeJsonFile } from "../file.service";

export interface User {
  id: string;
  name: string;
  login: string;
  email: string;
  phone: string;
  passwordHash: string;
}

type RegisterInput = {
  name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
};

export class UsersService {
  async getAll(): Promise<User[]> {
    return readJsonFile<User[]>(DB_PATHS.users, []);
  }

  async create(input: RegisterInput): Promise<User> {
    const users = await this.getAll();
    const conflicts = users.find(
      (item) =>
        item.email === input.email ||
        item.login === input.login ||
        item.phone === input.phone
    );

    if (conflicts) {
      throw new Error("Пользователь с таким email/логином/телефоном уже существует");
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: input.name,
      login: input.login,
      email: input.email,
      phone: input.phone,
      passwordHash: hashPassword(input.password)
    };

    users.push(newUser);
    await writeJsonFile(DB_PATHS.users, users);
    return newUser;
  }

  async findByCredentials(identifier: string, password: string): Promise<User | null> {
    const users = await this.getAll();
    const candidate = users.find(
      (item) =>
        item.email === identifier ||
        item.login === identifier ||
        item.phone === identifier ||
        item.name === identifier
    );

    if (!candidate) {
      return null;
    }

    return candidate.passwordHash === hashPassword(password) ? candidate : null;
  }

  async findById(userId: string): Promise<User | null> {
    const users = await this.getAll();
    return users.find((item) => item.id === userId) ?? null;
  }
}

function hashPassword(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}
