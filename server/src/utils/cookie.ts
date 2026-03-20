import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from "../constants/session";

export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) {
      return acc;
    }
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

export function buildSessionCookie(token: string): string {
  const maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000);
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${maxAgeSeconds}; HttpOnly; Path=/; SameSite=Lax`;
}

export function buildExpiredSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; HttpOnly; Path=/; SameSite=Lax`;
}
