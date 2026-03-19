import { Request, Response } from "express";
import { createSession, removeSession } from "../../services/session.service";
import { UsersService } from "../../services/users/users.service";
import {
  buildExpiredSessionCookie,
  buildSessionCookie,
  parseCookies
} from "../../utils/cookie";
import { SESSION_COOKIE_NAME } from "../../constants/session";

const usersService = new UsersService();

type ErrorWithMessage = { message: string };

function hasMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ErrorWithMessage).message === "string"
  );
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, login, phone, password } = req.body ?? {};

      if (!name || !email || !login || !phone || !password) {
        res.status(400).json({ error: "Заполните все поля регистрации" });
        return;
      }

      const user = await usersService.create({ name, email, login, phone, password });
      const session = createSession(user.id);
      res.setHeader("Set-Cookie", buildSessionCookie(session.token));

      res.status(201).json({
        message: "Регистрация успешна",
        user: { id: user.id, name: user.name, email: user.email, login: user.login, phone: user.phone }
      });
    } catch (error: unknown) {
      const message = hasMessage(error) ? error.message : "Ошибка регистрации";
      res.status(400).json({ error: message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
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

    const session = createSession(user.id);
    res.setHeader("Set-Cookie", buildSessionCookie(session.token));
    res.json({
      message: "Вход выполнен",
      user: { id: user.id, name: user.name, email: user.email, login: user.login, phone: user.phone }
    });
  }

  async me(req: Request, res: Response): Promise<void> {
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

  async logout(req: Request, res: Response): Promise<void> {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[SESSION_COOKIE_NAME];
    if (token) {
      removeSession(token);
    }

    res.setHeader("Set-Cookie", buildExpiredSessionCookie());
    res.json({ message: "Вы вышли из аккаунта" });
  }
}
