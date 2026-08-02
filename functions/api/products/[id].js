import { getDb } from "../../db.js";
import { products } from "../../db_schema/schema.js";
import { eq } from "drizzle-orm";

export async function onRequestPut(context) {
    try {
        const db = getDb(context.env);
        const body = await context.request.json();
        
        await db.update(products)
            .set({ 
                name: body.name,
                price: body.price,
                imageUrl: body.imageUrl,
                updatedAt: new Date() 
            })
            .where(eq(products.id, context.params.id));
            
        return Response.json({ success: true });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function onRequestDelete(context) {
    try {
        const db = getDb(context.env);
        
        await db.delete(products).where(eq(products.id, context.params.id));
            
        return Response.json({ success: true });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}