import { NextFunction, Request, Response } from "express";
import { SESSION_COOKIE_NAME } from "../constants/session";
import { getSession } from "../services/session.service";
import { parseCookies } from "../utils/cookie";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE_NAME];

  if (!token) {
    res.status(401).json({ error: "Не авторизован" });
    return;
  }

  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: "Сессия истекла. Войдите снова." });
    return;
  }

  req.userId = session.userId;
  next();
}
