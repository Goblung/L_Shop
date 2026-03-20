"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const paths_1 = require("../../constants/paths");
const file_service_1 = require("../file.service");
class UsersService {
    async getAll() {
        return (0, file_service_1.readJsonFile)(paths_1.DB_PATHS.users, []);
    }
    async create(input) {
        const users = await this.getAll();
        const conflicts = users.find((item) => item.email === input.email ||
            item.login === input.login ||
            item.phone === input.phone);
        if (conflicts) {
            throw new Error("Пользователь с таким email/логином/телефоном уже существует");
        }
        const newUser = {
            id: crypto_1.default.randomUUID(),
            name: input.name,
            login: input.login,
            email: input.email,
            phone: input.phone,
            passwordHash: hashPassword(input.password)
        };
        users.push(newUser);
        await (0, file_service_1.writeJsonFile)(paths_1.DB_PATHS.users, users);
        return newUser;
    }
    async findByCredentials(identifier, password) {
        const users = await this.getAll();
        const candidate = users.find((item) => item.email === identifier ||
            item.login === identifier ||
            item.phone === identifier ||
            item.name === identifier);
        if (!candidate) {
            return null;
        }
        return candidate.passwordHash === hashPassword(password) ? candidate : null;
    }
    async findById(userId) {
        const users = await this.getAll();
        return users.find((item) => item.id === userId) ?? null;
    }
}
exports.UsersService = UsersService;
function hashPassword(raw) {
    return crypto_1.default.createHash("sha256").update(raw).digest("hex");
}
