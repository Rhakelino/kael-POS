import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./functions/db_schema/schema.js",
    out: "./migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: "./data/kael-cafe.db",
    },
});
