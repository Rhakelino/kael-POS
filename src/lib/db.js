import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "../db/schema.js";

export function getDb() {
    try {
        const { getRequestContext } = require("@cloudflare/next-on-pages");
        const ctx = getRequestContext();
        if (ctx?.env?.DB) {
            return drizzleD1(ctx.env.DB, { schema });
        }
    } catch (e) {
        // Fallback if getRequestContext is missing
    }
    
    return new Proxy({}, {
        get: () => () => { throw new Error("Database not bound. DB binding is missing in Cloudflare."); }
    });
}

export const db = new Proxy({}, {
    get: (target, prop) => {
        const actualDb = getDb();
        return actualDb[prop];
    }
});

