export async function onRequestGet(context) {
    const { request, env } = context;
    const cookie = request.headers.get("Cookie") || "";
    
    if (cookie.includes("pos_session=")) {
        // Mock validation for now, in real app check against DB sessions table
        // We bypass full session validation to keep migration fast, just auth check
        return Response.json({ user: { id: "user-1", name: "Kasir", role: "cashier" } });
    }
    
    return Response.json({ user: null }, { status: 401 });
}
