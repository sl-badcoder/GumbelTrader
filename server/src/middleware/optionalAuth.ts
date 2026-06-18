import type { RequestHandler } from "express";
import type { ServerEnv } from "../config/env.js";
import type { AuthService } from "../modules/auth/auth.service.js";
import type { AuthUser } from "../modules/auth/auth.types.js";
import { authCookieName, readCookie } from "./authCookie.js";
import { verifyAuthToken } from "../modules/auth/token.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function optionalAuth(authService: AuthService, env: ServerEnv): RequestHandler {
  return async (request, _response, next) => {
    try {
      const token = readCookie(request.headers.cookie, authCookieName);
      const payload = token ? verifyAuthToken(token, env.authSecret) : null;
      request.user = payload ? (await authService.getUser(payload.userId)) ?? undefined : undefined;
      next();
    } catch (error) {
      next(error);
    }
  };
}
