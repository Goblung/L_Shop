"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PATHS = void 0;
const path_1 = __importDefault(require("path"));
const DB_DIR = path_1.default.join(process.cwd(), "database");
exports.DB_PATHS = {
    users: path_1.default.join(DB_DIR, "users.json"),
    basket: path_1.default.join(DB_DIR, "basket.json"),
    delivery: path_1.default.join(DB_DIR, "delivery.json"),
    products: path_1.default.join(DB_DIR, "products.json")
};
