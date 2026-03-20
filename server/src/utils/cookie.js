"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCookies = parseCookies;
exports.buildSessionCookie = buildSessionCookie;
exports.buildExpiredSessionCookie = buildExpiredSessionCookie;
const session_1 = require("../constants/session");
function parseCookies(cookieHeader) {
    if (!cookieHeader) {
        return {};
    }
    return cookieHeader.split(";").reduce((acc, part) => {
        const [key, ...rest] = part.trim().split("=");
        if (!key) {
            return acc;
        }
        acc[key] = decodeURIComponent(rest.join("="));
        return acc;
    }, {});
}
function buildSessionCookie(token) {
    const maxAgeSeconds = Math.floor(session_1.SESSION_TTL_MS / 1000);
    return `${session_1.SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${maxAgeSeconds}; HttpOnly; Path=/; SameSite=Lax`;
}
function buildExpiredSessionCookie() {
    return `${session_1.SESSION_COOKIE_NAME}=; Max-Age=0; HttpOnly; Path=/; SameSite=Lax`;
}
