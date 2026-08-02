import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "../db/schema.js";

export function getDb() {
    if (process.env.DB) {
        return drizzleD1(process.env.DB, { schema });
    }
    
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

