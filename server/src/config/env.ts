export type ServerEnv = {
  port: number;
  databaseUrl: string;
  authSecret: string;
  clientOrigin: string;
  isProduction: boolean;
};

export function loadEnv(): ServerEnv {
  const databaseUrl = process.env.DATABASE_URL;
  const authSecret = process.env.AUTH_SECRET;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  if (!authSecret || authSecret.length < 32) {
    throw new Error("AUTH_SECRET is required and must be at least 32 characters");
  }

  return {
    port: Number(process.env.PORT ?? 4000),
    databaseUrl,
    authSecret,
    clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    isProduction: process.env.NODE_ENV === "production"
  };
}
