import type { Response } from "express";
import type { ServerEnv } from "../config/env.js";

export const authCookieName = "gumbel_auth";

export function readCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const prefix = `${name}=`;
  const cookie = cookies.find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

export function setAuthCookie(response: Response, token: string, env: ServerEnv): void {
  response.cookie(authCookieName, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie(response: Response, env: ServerEnv): void {
  response.clearCookie(authCookieName, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/"
  });
}
