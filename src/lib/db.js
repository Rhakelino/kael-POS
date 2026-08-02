import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "../db/schema.js";

export function getDb() {
    // OpenNext expose binding ke process.env secara otomatis di cloud
    if (process.env.NODE_ENV === "production" || process.env.NEXT_RUNTIME === "edge") {
        if (process.env.DB) {
            return drizzleD1(process.env.DB, { schema });
        }
    }
    
    // Serverless/Node fallback (untuk local development dengan `npm run dev`)
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

