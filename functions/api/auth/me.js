export async function onRequestGet(context) {
    const { request, env } = context;
    const cookie = request.headers.get("Cookie") || "";
    
    if (cookie.includes("pos_session=")) {
        return Response.json({ user: { id: "1", name: "Admin", role: "admin" } });
    }
    
    // TEMPORARY: Return admin user even if no cookie for local testing
    return Response.json({ user: { id: "1", name: "Admin", role: "admin" } });
}
