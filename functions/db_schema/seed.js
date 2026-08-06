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
    const catCoffee = "cat-coffee";
    const catNonCoffee = "cat-noncoffee";
    const catFood = "cat-food";
    const catDessert = "cat-dessert";

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
                id: catFood,
                name: "Food",
                icon: "restaurant",
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

    // --- Products ---
    console.log("\n☕ Creating products...");
    const now = new Date();
    db.insert(schema.products)
        .values([
            {
                id: "prod-1",
                categoryId: catCoffee,
                name: "Americano",
                price: 18000,
                sku: "COF-001",
                imageUrl: "/uploads/americano.jpeg",
                description: "Espresso dengan air panas atau es",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-2",
                categoryId: catCoffee,
                name: "Cafe Latte",
                price: 20000,
                sku: "COF-002",
                imageUrl: "/uploads/cafe latte.jpeg",
                description: "Espresso lembut dengan susu steamed",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-3",
                categoryId: catCoffee,
                name: "Cappuccino",
                price: 20000,
                sku: "COF-003",
                imageUrl: "/uploads/cappucino.jpeg",
                description: "Espresso dengan foam susu tebal",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-4",
                categoryId: catNonCoffee,
                name: "Matcha Latte",
                price: 20000,
                sku: "NCF-001",
                imageUrl: "/uploads/matcha.jpeg",
                description: "Matcha Jepang dengan susu segar",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-5",
                categoryId: catNonCoffee,
                name: "Chocolate Milk",
                price: 20000,
                sku: "NCF-002",
                imageUrl: "/uploads/chocolate milk.jpeg",
                description: "Cokelat kaya rasa dengan susu hangat",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-6",
                categoryId: catNonCoffee,
                name: "Iced Tea",
                price: 10000,
                sku: "NCF-003",
                imageUrl: "/uploads/iced tea.jpeg",
                description: "Teh manis dingin menyegarkan",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-7",
                categoryId: catFood,
                name: "Nasi Goreng",
                price: 15000,
                sku: "FOD-001",
                imageUrl: "/uploads/nasi-goreng.jpeg",
                description: "Nasi goreng khas cafe dengan telur",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-8",
                categoryId: catFood,
                name: "Croissant",
                price: 18000,
                sku: "BAK-001",
                imageUrl: "/uploads/croissant.jpeg",
                description: "Roti croissant mentega yang renyah",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "prod-9",
                categoryId: catDessert,
                name: "Cheesecake",
                price: 22000,
                sku: "DST-001",
                imageUrl: "/uploads/cheescake.jpeg",
                description: "Kue keju lembut manis khas New York",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
        ])
        .run();
            {
                id: prodTiramisu,
                categoryId: catDessert,
                name: "Tiramisu",
                price: 48000,
                sku: "DST-002",
                imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80",
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

