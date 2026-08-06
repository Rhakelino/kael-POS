import { getDb } from "../../db.js";
import { users } from "../../db_schema/schema.js";

export async function onRequestGet(context) {
    const { request, env } = context;
    const cookie = request.headers.get("Cookie") || "";
    
    if (cookie.includes("pos_session=") && !cookie.includes("pos_session=;")) {
        try {
            const db = getDb(env);
            const user = await db.query.users.findFirst();
            if (user) {
                return Response.json({ user: { id: user.id, name: user.name, role: user.role } });
            }
        } catch (e) {
            // DB fallback
        }
        return Response.json({ user: { id: null, name: "Kasir", role: "cashier" } });
    }
    
    return Response.json({ user: null }, { status: 401 });
}
