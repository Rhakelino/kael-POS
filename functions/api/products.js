import { getDb } from "../db.js";
import { products, categories } from "../db_schema/schema.js";
import { eq, desc } from "drizzle-orm";

export async function onRequestGet(context) {
    const db = getDb(context.env);
    const url = new URL(context.request.url);
    const categoryId = url.searchParams.get("categoryId");

    try {
        let result;
        if (categoryId) {
            result = await db.query.products.findMany({
                where: eq(products.categoryId, categoryId),
                with: { category: true },
                orderBy: [desc(products.createdAt)]
            });
        } else {
            result = await db.query.products.findMany({
                with: { category: true },
                orderBy: [desc(products.createdAt)]
            });
        }
        return Response.json({ success: true, data: result });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function onRequestPost(context) {
    try {
        const db = getDb(context.env);
        const body = await context.request.json();
        const id = crypto.randomUUID();
        
        await db.insert(products).values({
            id,
            categoryId: body.categoryId,
            name: body.name,
            price: body.price,
            sku: body.sku,
            imageUrl: body.imageUrl,
            isActive: 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        
        return Response.json({ success: true, id });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}
