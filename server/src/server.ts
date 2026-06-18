import { loadEnv } from "./config/env.js";
import { createDb } from "./db/db.js";
import { createApp } from "./app.js";

const env = loadEnv();
const db = createDb(env);
const app = createApp(env, db);

app.listen(env.port, () => {
  console.log(`API server listening on http://localhost:${env.port}`);
});
