import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "../db/schema.js";
import { getRequestContext } from "@cloudflare/next-on-pages";

export function getDb() {
    if (process.env.NODE_ENV === "production" || process.env.NEXT_RUNTIME === "edge") {
        const ctx = getRequestContext();
        if (ctx?.env?.DB) {
            return drizzleD1(ctx.env.DB, { schema });
        }
    }
    
    // Serverless/Node fallback (untuk Drizzle Kit Studio / Push lokal)
    const Database = require("better-sqlite3");
    const { drizzle: drizzleBetter } = require("drizzle-orm/better-sqlite3");
    const path = require("path");
    
    const dbPath = path.resolve(process.cwd(), "data/kael-cafe.db");
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    
    return drizzleBetter(sqlite, { schema });
}

export const db = new Proxy({}, {
    get: (target, prop) => {
        const actualDb = getDb();
        return actualDb[prop];
    }
});

