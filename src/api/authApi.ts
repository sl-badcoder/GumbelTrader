import { apiRequest } from "./apiClient";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export function getCurrentUser(): Promise<{ user: AuthUser | null }> {
  return apiRequest("/auth/me");
}

export function login(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function register(input: {
  email: string;
  displayName: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function logout(): Promise<void> {
  return apiRequest("/auth/logout", { method: "POST" });
}
