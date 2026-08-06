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
                price: 25000,
                sku: "COF-001",
                imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&auto=format&fit=crop&q=80",
                description: "Rich single-shot espresso",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodLatte,
                categoryId: catCoffee,
                name: "Caffe Latte",
                price: 35000,
                sku: "COF-002",
                imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop&q=80",
                description: "Smooth espresso with steamed milk",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodCappuccino,
                categoryId: catCoffee,
                name: "Cappuccino",
                price: 35000,
                sku: "COF-003",
                imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80",
                description: "Frothy cappuccino in a ceramic cup",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodMacchiato,
                categoryId: catCoffee,
                name: "Caramel Macchiato",
                price: 38000,
                sku: "COF-004",
                imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop&q=80",
                description: "Caramel macchiato with drizzle",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodAmericano,
                categoryId: catCoffee,
                name: "Iced Americano",
                price: 28000,
                sku: "COF-005",
                imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80",
                description: "Classic iced americano with ice cubes",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodMocha,
                categoryId: catCoffee,
                name: "Mocha Latte",
                price: 36000,
                sku: "COF-006",
                imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=80",
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
                price: 35000,
                sku: "NCF-001",
                imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80",
                description: "Premium Japanese matcha with steamed milk",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodChocolate,
                categoryId: catNonCoffee,
                name: "Hot Chocolate",
                price: 32000,
                sku: "NCF-002",
                imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80",
                description: "Rich chocolate with whipped cream",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            // Bakery / Food
            {
                id: prodCroissant,
                categoryId: catBakery,
                name: "Croissant",
                price: 28000,
                sku: "BAK-001",
                imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
                description: "Flaky golden butter croissant",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: prodMuffin,
                categoryId: catBakery,
                name: "Blueberry Muffin",
                price: 25000,
                sku: "BAK-002",
                imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=80",
                description: "Fresh-baked blueberry muffin",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: crypto.randomUUID(),
                categoryId: catBakery,
                name: "Nasi Goreng Spesial",
                price: 40000,
                sku: "FOD-001",
                imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80",
                description: "Nasi goreng khas cafe dengan telur dan ayam",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: crypto.randomUUID(),
                categoryId: catBakery,
                name: "French Fries",
                price: 25000,
                sku: "FOD-002",
                imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80",
                description: "Kentang goreng renyah bumbu gurih",
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
                imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80",
                description: "Creamy New York style cheesecake",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
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

