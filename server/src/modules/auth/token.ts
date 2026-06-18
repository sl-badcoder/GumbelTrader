import crypto from "node:crypto";
import type { AuthTokenPayload } from "./auth.types.js";

const tokenTtlMs = 1000 * 60 * 60 * 24 * 7;

export function createAuthToken(userId: string, secret: string): string {
  const payload: AuthTokenPayload = {
    userId,
    expiresAt: Date.now() + tokenTtlMs
  };
  const body = toBase64Url(JSON.stringify(payload));
  const signature = sign(body, secret);
  return `${body}.${signature}`;
}

export function verifyAuthToken(token: string, secret: string): AuthTokenPayload | null {
  const [body, signature] = token.split(".");

  if (!body || !signature || sign(body, secret) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as AuthTokenPayload;
    if (!payload.userId || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function sign(value: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}
