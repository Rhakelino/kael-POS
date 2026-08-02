"use server";

import { db } from "@/lib/db";
import { categories, products } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export async function getCategories() {
    try {
        const result = await db.query.categories.findMany({
            where: eq(categories.isActive, true),
            orderBy: [asc(categories.sortOrder)],
        });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getProducts(categoryId = null) {
    try {
        const conditions = [eq(products.isActive, true)];
        if (categoryId) {
            conditions.push(eq(products.categoryId, categoryId));
        }

        const result = await db.query.products.findMany({
            where: categoryId
                ? (fields, { and }) =>
                    and(eq(fields.isActive, true), eq(fields.categoryId, categoryId))
                : eq(products.isActive, true),
            with: {
                category: true,
            },
            orderBy: [asc(products.name)],
        });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAllProducts() {
    try {
        const result = await db.query.products.findMany({
            with: {
                category: true,
            },
            orderBy: [desc(products.createdAt)],
        });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createProduct(data) {
    try {
        const id = crypto.randomUUID();
        const now = new Date();
        await db.insert(products).values({
            id,
            categoryId: data.categoryId,
            name: data.name,
            price: data.price,
            sku: data.sku || null,
            imageUrl: data.imageUrl || null,
            description: data.description || null,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateProduct(id, data) {
    try {
        await db
            .update(products)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(products.id, id));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function toggleProduct(id) {
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, id),
        });
        if (!product) return { success: false, error: "Product not found" };

        await db
            .update(products)
            .set({
                isActive: !product.isActive,
                updatedAt: new Date(),
            })
            .where(eq(products.id, id));
        return { success: true, isActive: !product.isActive };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteProduct(id) {
    try {
        await db.delete(products).where(eq(products.id, id));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createCategory(data) {
    try {
        const id = crypto.randomUUID();
        await db.insert(categories).values({
            id,
            name: data.name,
            icon: data.icon || null,
            sortOrder: data.sortOrder || 0,
            isActive: true,
            createdAt: new Date(),
        });
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateCategory(id, data) {
    try {
        await db.update(categories).set(data).where(eq(categories.id, id));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteCategory(id) {
    try {
        await db.delete(categories).where(eq(categories.id, id));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
