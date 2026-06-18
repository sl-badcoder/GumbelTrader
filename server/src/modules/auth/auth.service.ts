import type { ServerEnv } from "../../config/env.js";
import { conflict, unauthorized, badRequest } from "../../shared/http.js";
import { isEmail } from "../../shared/validation.js";
import type { AuthUser } from "./auth.types.js";
import { hashPassword, verifyPassword } from "./password.js";
import { createAuthToken } from "./token.js";
import type { AuthRepository } from "./auth.repository.js";

export class AuthService {
  constructor(
    private readonly users: AuthRepository,
    private readonly env: ServerEnv
  ) {}

  async register(input: {
    email: string;
    displayName: string;
    password: string;
  }): Promise<{ user: AuthUser; token: string }> {
    const email = input.email.toLowerCase();
    if (!isEmail(email)) {
      throw badRequest("Invalid email address");
    }

    if (input.password.length < 8) {
      throw badRequest("Password must be at least 8 characters");
    }

    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      throw conflict("Email is already registered");
    }

    const user = await this.users.create({
      email,
      displayName: input.displayName,
      passwordHash: await hashPassword(input.password)
    });

    return {
      user: toAuthUser(user),
      token: createAuthToken(user.id, this.env.authSecret)
    };
  }

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ user: AuthUser; token: string }> {
    const user = await this.users.findByEmail(input.email.toLowerCase());

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw unauthorized("Invalid email or password");
    }

    return {
      user: toAuthUser(user),
      token: createAuthToken(user.id, this.env.authSecret)
    };
  }

  async getUser(userId: string): Promise<AuthUser | null> {
    const user = await this.users.findById(userId);
    return user ? toAuthUser(user) : null;
  }
}

function toAuthUser(user: {
  id: string;
  email: string;
  displayName: string;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName
  };
}
