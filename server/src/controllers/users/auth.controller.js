"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const session_service_1 = require("../../services/session.service");
const users_service_1 = require("../../services/users/users.service");
const cookie_1 = require("../../utils/cookie");
const session_1 = require("../../constants/session");
const usersService = new users_service_1.UsersService();
function hasMessage(error) {
    return (typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string");
}
class AuthController {
    async register(req, res) {
        try {
            const { name, email, login, phone, password } = req.body ?? {};
            if (!name || !email || !login || !phone || !password) {
                res.status(400).json({ error: "Заполните все поля регистрации" });
                return;
            }
            const user = await usersService.create({ name, email, login, phone, password });
            const session = (0, session_service_1.createSession)(user.id);
            res.setHeader("Set-Cookie", (0, cookie_1.buildSessionCookie)(session.token));
            res.status(201).json({
                message: "Регистрация успешна",
                user: { id: user.id, name: user.name, email: user.email, login: user.login, phone: user.phone }
            });
        }
        catch (error) {
            const message = hasMessage(error) ? error.message : "Ошибка регистрации";
            res.status(400).json({ error: message });
        }
    }
    async login(req, res) {
        const { identifier, password } = req.body ?? {};
        if (!identifier || !password) {
            res.status(400).json({ error: "Укажите идентификатор и пароль" });
            return;
        }
        const user = await usersService.findByCredentials(identifier, password);
        if (!user) {
            res.status(401).json({ error: "Неверные данные для входа" });
            return;
        }
        const session = (0, session_service_1.createSession)(user.id);
        res.setHeader("Set-Cookie", (0, cookie_1.buildSessionCookie)(session.token));
        res.json({
            message: "Вход выполнен",
            user: { id: user.id, name: user.name, email: user.email, login: user.login, phone: user.phone }
        });
    }
    async me(req, res) {
        if (!req.userId) {
            res.status(401).json({ error: "Не авторизован" });
            return;
        }
        const user = await usersService.findById(req.userId);
        if (!user) {
            res.status(401).json({ error: "Пользователь не найден" });
            return;
        }
        res.json({ id: user.id, name: user.name, email: user.email, login: user.login, phone: user.phone });
    }
    async logout(req, res) {
        const cookies = (0, cookie_1.parseCookies)(req.headers.cookie);
        const token = cookies[session_1.SESSION_COOKIE_NAME];
        if (token) {
            (0, session_service_1.removeSession)(token);
        }
        res.setHeader("Set-Cookie", (0, cookie_1.buildExpiredSessionCookie)());
        res.json({ message: "Вы вышли из аккаунта" });
    }
}
exports.AuthController = AuthController;
