import { getDb } from "../../db.js";
import { users } from "../../db_schema/schema.js";
import { eq, and } from "drizzle-orm";

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const db = getDb(env);

        const user = await db.query.users.findFirst({
            where: body.email ? and(eq(users.email, body.email), eq(users.pin, body.pin)) : eq(users.pin, body.pin)
        });

        if (!user) {
            return Response.json({ success: false, error: "Email atau PIN salah" }, { status: 401 });
        }

        // Generate simple mock session for this example
        const sessionToken = crypto.randomUUID();
        
        // Return response with cookie
        return new Response(JSON.stringify({ success: true, user: { id: user.id, name: user.name, role: user.role } }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `pos_session=${sessionToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${env.ENVIRONMENT === 'production' ? '; Secure' : ''}`
            }
        });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}
