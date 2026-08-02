import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db_schema/schema.js";

export function getDb(env) {
    if (!env || !env.DB) {
        throw new Error("DB binding is missing. Make sure D1 is bound as 'DB' in wrangler.toml or Cloudflare dashboard.");
    }
    return drizzle(env.DB, { schema });
}

