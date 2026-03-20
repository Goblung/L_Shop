"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const session_1 = require("../constants/session");
const session_service_1 = require("../services/session.service");
const cookie_1 = require("../utils/cookie");
function authMiddleware(req, res, next) {
    const cookies = (0, cookie_1.parseCookies)(req.headers.cookie);
    const token = cookies[session_1.SESSION_COOKIE_NAME];
    if (!token) {
        res.status(401).json({ error: "Не авторизован" });
        return;
    }
    const session = (0, session_service_1.getSession)(token);
    if (!session) {
        res.status(401).json({ error: "Сессия истекла. Войдите снова." });
        return;
    }
    req.userId = session.userId;
    next();
}
