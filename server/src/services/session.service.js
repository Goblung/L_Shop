"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSession = getSession;
exports.removeSession = removeSession;
const crypto_1 = __importDefault(require("crypto"));
const session_1 = require("../constants/session");
const sessions = new Map();
function createSession(userId) {
    const token = crypto_1.default.randomBytes(24).toString("hex");
    const expiresAt = Date.now() + session_1.SESSION_TTL_MS;
    sessions.set(token, { userId, expiresAt });
    return { token, expiresAt };
}
function getSession(token) {
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
function removeSession(token) {
    sessions.delete(token);
}
