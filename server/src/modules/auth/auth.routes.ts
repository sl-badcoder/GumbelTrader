import { Router } from "express";
import type { ServerEnv } from "../../config/env.js";
import { clearAuthCookie, setAuthCookie } from "../../middleware/authCookie.js";
import { requireString } from "../../shared/validation.js";
import type { AuthService } from "./auth.service.js";

export function createAuthRoutes(authService: AuthService, env: ServerEnv): Router {
  const router = Router();

  router.post("/register", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const result = await authService.register({
        email: requireString(body.email, "email"),
        displayName: requireString(body.displayName, "displayName"),
        password: requireString(body.password, "password")
      });
      setAuthCookie(response, result.token, env);
      response.status(201).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const result = await authService.login({
        email: requireString(body.email, "email"),
        password: requireString(body.password, "password")
      });
      setAuthCookie(response, result.token, env);
      response.json({ user: result.user });
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", (_request, response) => {
    clearAuthCookie(response, env);
    response.status(204).send();
  });

  router.get("/me", (request, response) => {
    response.json({ user: request.user ?? null });
  });

  return router;
}
