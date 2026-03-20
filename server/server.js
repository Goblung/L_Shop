"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./src/router/router"));
const app = (0, express_1.default)();
const PORT = 4000;
const HOST = "0.0.0.0";
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
// Статика для картинок товаров.
// URL вида `/img/<filename>` будут раздаваться из `server/database/img`.
app.use("/img", express_1.default.static(path_1.default.join(__dirname, "database", "img")));
app.use("/api", router_1.default);
app.listen(PORT, HOST, () => {
    console.log(`Server started at http://${HOST}:${PORT}`);
});
