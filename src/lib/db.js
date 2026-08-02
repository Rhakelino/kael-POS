import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "../db/schema.js";
import { getRequestContext } from "@cloudflare/next-on-pages";

export function getDb() {
    const ctx = getRequestContext();
    if (ctx?.env?.DB) {
        return drizzleD1(ctx.env.DB, { schema });
    }
    
    // Fallback DUMMY kalau dipanggil di luar edge
    return new Proxy({}, {
        get: () => () => { throw new Error("Database not bound. process.env.DB is missing."); }
    });
}

export const db = new Proxy({}, {
    get: (target, prop) => {
        const actualDb = getDb();
        return actualDb[prop];
    }
});

