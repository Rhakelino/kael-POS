import { getDb } from "../db.js";
import { categories } from "../db_schema/schema.js";

export async function onRequestGet(context) {
    try {
        const db = getDb(context.env);
        const result = await db.query.categories.findMany();
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
        
        await db.insert(categories).values({
            id,
            name: body.name,
            icon: body.icon,
            sortOrder: 0,
            isActive: 1,
            createdAt: Date.now(),
        });
        
        return Response.json({ success: true, id });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}
