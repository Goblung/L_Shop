"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
const promises_1 = __importDefault(require("fs/promises"));
async function readJsonFile(filePath, fallback) {
    try {
        const raw = await promises_1.default.readFile(filePath, "utf-8");
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
async function writeJsonFile(filePath, data) {
    await promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
