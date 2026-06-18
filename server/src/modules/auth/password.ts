import bcrypt from "bcryptjs";

const passwordCost = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, passwordCost);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
