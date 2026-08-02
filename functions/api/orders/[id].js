import { getDb } from "../../db.js";
import { orders } from "../../db_schema/schema.js";
import { eq } from "drizzle-orm";

export async function onRequestPut(context) {
    try {
        const db = getDb(context.env);
        const body = await context.request.json();
        const id = context.params.id;
        
        await db.update(orders).set({ status: body.status, updatedAt: Date.now() }).where(eq(orders.id, id));
        return Response.json({ success: true });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}
