import { badRequest } from "./http.js";

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw badRequest(`${field} is required`);
  }

  return value.trim();
}

export function requireNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw badRequest(`${field} must be a number`);
  }

  return value;
}

export function optionalObject(value: unknown, field: string): Record<string, unknown> | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw badRequest(`${field} must be an object or null`);
  }

  return value as Record<string, unknown>;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
