import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import type { ServerEnv } from "../../config/env.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import type { UserRepository } from "../users/user.repository.js";
import type { UserRecord } from "../users/user.types.js";
import { createAuthRoutes } from "./auth.routes.js";
import { AuthService } from "./auth.service.js";

const env: ServerEnv = {
  port: 0,
  databaseUrl: "postgres://test",
  authSecret: "test-secret-at-least-32-characters-long",
  clientOrigin: "http://localhost:5173",
  isProduction: false
};

describe.skip("auth routes", () => {
  it("registers a user and does not return the password hash", async () => {
    const users: UserRecord[] = [];
    const repository: UserRepository = {
      create: async (input) => {
        const user = {
          id: "user-1",
          email: input.email,
          displayName: input.displayName,
          passwordHash: input.passwordHash,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        return user;
      },
      findByEmail: async (email) => users.find((user) => user.email === email) ?? null,
      findById: async (id) => users.find((user) => user.id === id) ?? null
    };
    const app = express();
    app.use(express.json());
    app.use("/api/auth", createAuthRoutes(new AuthService(repository, env), env));
    app.use(errorHandler);

    const response = await request(app).post("/api/auth/register").send({
      email: "person@example.com",
      displayName: "Person",
      password: "password123"
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toEqual({
      id: "user-1",
      email: "person@example.com",
      displayName: "Person"
    });
    expect(response.body.user.passwordHash).toBeUndefined();
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(users[0]?.passwordHash).not.toBe("password123");
  });
});
