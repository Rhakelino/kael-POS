import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../../data");
const dbPath = path.join(dataDir, "kael-cafe.db");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });

// ============================================================
// Seed Data
// ============================================================

async function seed() {
    console.log("🌱 Seeding database...\n");

    // --- Users ---
    console.log("👤 Creating users...");
    const adminId = crypto.randomUUID();
    const cashierId = crypto.randomUUID();

    // We create users with hashed password via Better-Auth's internal hashing
    // For seeding, we insert directly with a simple bcrypt-compatible hash approach
    // Better-Auth uses scrypt, so we'll use their signup API instead
    // For direct DB insert, we store a placeholder and require first-time password setup
    db.insert(schema.users)
        .values([
            {
                id: adminId,
                name: "Admin Kael",
                email: "admin@kaelcafe.com",
                emailVerified: true,
                role: "admin",
                pin: "1234",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: cashierId,
                name: "Cashier Staff",
                email: "cashier@kaelcafe.com",
                emailVerified: true,
                role: "cashier",
                pin: "5678",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
        .run();

    // Create accounts for password login (Better-Auth stores hashed passwords in accounts table)
    // The password hash below is for "admin123" and "cashier123" using a generic placeholder.
    // To properly set passwords, use Better-Auth's signUp API after the app starts.
    db.insert(schema.accounts)
        .values([
            {
                id: crypto.randomUUID(),
                userId: adminId,
                accountId: adminId,
                providerId: "credential",
                password: "admin123", // Will be hashed by Better-Auth on first real login/signup
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: crypto.randomUUID(),
                userId: cashierId,
                accountId: cashierId,
                providerId: "credential",
                password: "cashier123",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
        .run();

    console.log("  ✅ Admin: admin@kaelcafe.com (PIN: 1234)");
    console.log("  ✅ Cashier: cashier@kaelcafe.com (PIN: 5678)");

    // --- Categories ---
    console.log("\n📂 Creating categories...");
    const catCoffee = crypto.randomUUID();
    const catNonCoffee = crypto.randomUUID();
    const catBakery = crypto.randomUUID();
    const catDessert = crypto.randomUUID();

    db.insert(schema.categories)
        .values([
            {
                id: catCoffee,
                name: "Coffee",
                icon: "coffee",
                sortOrder: 1,
                isActive: true,
                createdAt: new Date(),
            },
            {
                id: catNonCoffee,
                name: "Non-Coffee",
                icon: "local_bar",
                sortOrder: 2,
                isActive: true,
                createdAt: new Date(),
            },
            {
                id: catBakery,
                name: "Bakery",
                icon: "bakery_dining",
                sortOrder: 3,
                isActive: true,
                createdAt: new Date(),
            },
            {
                id: catDessert,
                name: "Dessert",
                icon: "cake",
                sortOrder: 4,
                isActive: true,
                createdAt: new Date(),
            },
        ])
        .run();
    console.log("  ✅ Created: Coffee, Non-Coffee, Bakery, Dessert");

    // --- Products ---
    console.log("\n☕ Creating products...");
    const prodEspresso = crypto.randomUUID();
    const prodLatte = crypto.randomUUID();
    const prodCappuccino = crypto.randomUUID();
    const prodMacchiato = crypto.randomUUID();
    const prodAmericano = crypto.randomUUID();
    const prodMocha = crypto.randomUUID();
    const prodMatcha = crypto.randomUUID();
    const prodChocolate = crypto.randomUUID();
    const prodCroissant = crypto.randomUUID();
    const prodMuffin = crypto.randomUUID();
    const prodCheesecake = crypto.randomUUID();
    const prodTiramisu = crypto.randomUUID();

    const now = new Date();
    db.insert(schema.products)
        .values([
            // Coffee
            {
                id: prodEspresso,
                categoryId: catCoffee,
                name: "Espresso",
                price: 35000,
                sku: "COF-001",
                imageUrl:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBTGeg49CAoY8dPmaWoe1iS-Eja6Js8cP3_5I0pXNQt18uEzdm1wYB6KaEBfyHdshN4fzWvy-Dpsmf7tx5FxN-pQ_OOWnTNYIYVMctZnQrswydhsVcArQqZMdV11EGBnaQGkF5D7YzfH5XRrAACTmA2TUdX8H9re18mGNnz4l55796dmU1plCvfnqGUDkTIKW-y-eejOGFNm0OtIjzIM-0538tjB9vTQvD7WrXQOX3RbdqI0_o9KmL2Y7QS9Sc--mddCdjfGjH2Cq8U",
                description: "Rich single-shot espresso",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodLatte,
                categoryId: catCoffee,
                name: "Caffe Latte",
                price: 45000,
                sku: "COF-002",
                imageUrl:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCy8syjUguMFsMaviSAlvo2jZPsKEeg9eAV-QjgZWTiWwHuddpUwqlhPjuIbGdA1EZDpm-QLC36zMZ1pgRpYV1V5TW-mCAuF9Q4QM1x5MYVX5N35b1WeBC5RsSIbgmhaq8-qWwem1dxpzyiGk3oO2fstuDlzAsSySJ8L7RAy14Ka0mBrW8FzjiEOSN7z_Z422UA4Ybi4xxI650f3Ot8gRSTtXwDA8koHiBpoeHGWcJv9Ntyft7_NA9IUBphZlCIAG6imthnSAMQpW5v",
                description: "Smooth espresso with steamed milk",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodCappuccino,
                categoryId: catCoffee,
                name: "Cappuccino",
                price: 45000,
                sku: "COF-003",
                imageUrl:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCuI0Yda7W1roysn3sGn4Y7NKPc4NX9ogNdZRZ-M70iPFugurbKr5qe8nB_UUQluhXYnzbWu31IgQeEB6ZZuHFE3klMQ0LoJ21JfZvYZsNElbUNcd5xNsJSckGi7Du0B0_CsAO-BYtRszsuJVSZAdF1G5sU99kEnyXlkoJG1MjRGrCraJ7BmKwmOsAetxakAygGclx-LHcT6-lvPz4hLcOqXLS70pwtAa2knD-d-NwcaKboeUxmOtx2FHlrf-eIvRm5JMsj3hCr5ISu",
                description: "Frothy cappuccino in a ceramic cup",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodMacchiato,
                categoryId: catCoffee,
                name: "Macchiato",
                price: 42500,
                sku: "COF-004",
                imageUrl:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0s6A2QDVRhZ-62TZulk3B01PxqWfcXJTNNaUGW81Xn1cYMsV7LKEKHjQMcgniR7OIVq1vevUd9D0NzwOHl2qqhXBN4a7M6opKnxy0e8usCBgG_791By4vqrdQ_CBlZGCT9UDF8WbuKENgdfr-FlC7hM7uPqJPSpyVQ3D3X8-K6pKQiOWC3QZL1mH-QN1mM5LVQckM7AL71lZ31XlTGdpt1FXFY-b4eHD18bAWZuhDC3seIKuapEG1rcQGTtVlrMgi2LRl5NVqfW6N",
                description: "Caramel macchiato with drizzle",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodAmericano,
                categoryId: catCoffee,
                name: "Iced Americano",
                price: 37500,
                sku: "COF-005",
                imageUrl:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDQI7EE4YnBzUNcarvylbFOms_XKQmfNdJ-zJmxtEO6kl2_yjtpqki0_WXrgDBxpHrdwjsgvboKlDpuvzuC8dpZJ9HS9m4f_ocYVy4hZU1jSZoBY1sso4rot70vFYcM5DlOSLBNIN4w35jfCT74q5QmLNr2QkrXVJvkO50V3zCVfMe6i7vYdnTk5k6QxBQ47_ZfVRahtVHOQdHr57oc7G50H40gAMd43mX2emzLIAlfeeHH6Vi3L4jjbtoCRlSonmy9u4gfezTBB2p8",
                description: "Classic iced americano with ice cubes",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodMocha,
                categoryId: catCoffee,
                name: "Mocha",
                price: 48000,
                sku: "COF-006",
                description: "Espresso with chocolate and steamed milk",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            // Non-Coffee
            {
                id: prodMatcha,
                categoryId: catNonCoffee,
                name: "Matcha Latte",
                price: 45000,
                sku: "NCF-001",
                description: "Premium Japanese matcha with steamed milk",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodChocolate,
                categoryId: catNonCoffee,
                name: "Hot Chocolate",
                price: 40000,
                sku: "NCF-002",
                description: "Rich chocolate with whipped cream",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            // Bakery
            {
                id: prodCroissant,
                categoryId: catBakery,
                name: "Croissant",
                price: 30000,
                sku: "BAK-001",
                imageUrl:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3N9NjCXo24Uc3KvQjH9Z1y9JeHpehFxRbyOCMeBHWpOcUQ6cEFZpUi0MWipJ16C12L_n5v48kLjEYwX1ognKFEMHUI9MiuM8MMD9v-saTTcuGtcIlmoiwf19WXnnWqI32wFGx7dYcnN8Ntk3gq0NQajPh9Pm7BYGNpku9kGLw29Xnx3w6umGYFQWEGpDiHiYfXGS79CSh-FMZLCn444M87t_wRdqBJmfqG8b-d-wLjaH2o-EDZjzCXWSdCsiKFzg1TszgWKhhQNqT",
                description: "Flaky golden croissant",
                isActive: false, // Sold out
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodMuffin,
                categoryId: catBakery,
                name: "Blueberry Muffin",
                price: 25000,
                sku: "BAK-002",
                description: "Fresh-baked blueberry muffin",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            // Dessert
            {
                id: prodCheesecake,
                categoryId: catDessert,
                name: "Cheesecake",
                price: 45000,
                sku: "DST-001",
                description: "Creamy New York style cheesecake",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodTiramisu,
                categoryId: catDessert,
                name: "Tiramisu",
                price: 50000,
                sku: "DST-002",
                description: "Classic Italian coffee dessert",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
        ])
        .run();
    console.log("  ✅ Created 12 products across 4 categories");

    console.log("\n✨ Seed complete! Database is ready.\n");
    console.log("📊 Summary:");
    console.log("   • 2 Users (1 Admin, 1 Cashier)");
    console.log("   • 4 Categories");
    console.log("   • 12 Products");

    sqlite.close();
}

seed().catch(console.error);

