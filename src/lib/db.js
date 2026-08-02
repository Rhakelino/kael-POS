import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "../db/schema.js";

// Lazy-load DB from Cloudflare Context
export function getDb() {
    // Edge/Cloudflare environment
    if (typeof process === "undefined" || process.env.NEXT_RUNTIME === "edge") {
        const { getRequestContext } = require("@cloudflare/next-on-pages");
        const ctx = getRequestContext();
        if (ctx?.env?.DB) {
            return drizzleD1(ctx.env.DB, { schema });
        }
    }
    
    // Serverless/Node fallback (untuk Drizzle Kit Studio / Push lokal)
    // Jangan di-load di edge
    const Database = require("better-sqlite3");
    const { drizzle: drizzleBetter } = require("drizzle-orm/better-sqlite3");
    const path = require("path");
    
    const dbPath = path.resolve(process.cwd(), "data/kael-cafe.db");
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    
    return drizzleBetter(sqlite, { schema });
}

// Proxy wrapper biar nggak break import `import { db } from "@/lib/db"`
export const db = new Proxy({}, {
    get: (target, prop) => {
        const actualDb = getDb();
        return actualDb[prop];
    }
});
