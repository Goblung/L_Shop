import crypto from "crypto";
import { SESSION_TTL_MS } from "../constants/session";

type Session = {
  userId: string;
  expiresAt: number;
};

const sessions = new Map<string, Session>();

export function createSession(userId: string): { token: string; expiresAt: number } {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, { userId, expiresAt });
  return { token, expiresAt };
}

export function getSession(token: string): Session | null {
  const session = sessions.get(token);
  if (!session) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export function removeSession(token: string): void {
  sessions.delete(token);
}
