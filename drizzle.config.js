import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./functions/db_schema/schema.js",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: "./data/kael-cafe.db",
    },
});
