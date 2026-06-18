import pg from "pg";
import type { ServerEnv } from "../config/env.js";

export type Db = pg.Pool;

export function createDb(env: ServerEnv): Db {
  return new pg.Pool({
    connectionString: env.databaseUrl
  });
}
