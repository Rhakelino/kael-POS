import { getDb } from "../../db.js";
import { products } from "../../db_schema/schema.js";

export async function onRequestPost(context) {
    try {
        const db = getDb(context.env);
        const body = await context.request.json();
        
        await db.insert(products).values({
            id: crypto.randomUUID(),
            categoryId: body.categoryId,
            name: body.name,
            price: body.price,
            imageUrl: body.imageUrl || null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
            
        return Response.json({ success: true });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}