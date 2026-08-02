import { getDb } from "../db.js";
import { orders, orderItems } from "../db_schema/schema.js";
import { eq, desc } from "drizzle-orm";

function generateOrderNumber() {
    const now = new Date();
    return `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000) + 1000}`;
}

export async function onRequestGet(context) {
    try {
        const db = getDb(context.env);
        const result = await db.query.orders.findMany({
            with: { items: true },
            orderBy: [desc(orders.createdAt)]
        });
        return Response.json({ success: true, data: result });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function onRequestPost(context) {
    try {
        const db = getDb(context.env);
        const body = await context.request.json();
        
        const orderNumber = generateOrderNumber();
        const orderId = crypto.randomUUID();
        const now = Date.now();
        
        let subtotal = 0;
        for (const item of body.items) { subtotal += item.price * item.quantity; }
        
        const changeAmount = body.amountPaid ? body.amountPaid - subtotal : null;
        
        // D1 Batched execution
        const stmts = [
            db.insert(orders).values({
                id: orderId,
                orderNumber,
                subtotal,
                tax: 0,
                discount: 0,
                total: subtotal,
                paymentMethod: body.paymentMethod,
                amountPaid: body.amountPaid,
                changeAmount,
                status: "new",
                cashierId: body.cashierId,
                createdAt: now,
                updatedAt: now,
            })
        ];
        
        for (const item of body.items) {
            stmts.push(db.insert(orderItems).values({
                id: crypto.randomUUID(),
                orderId,
                productId: item.productId,
                productName: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                subtotal: item.price * item.quantity,
            }));
        }
        
        await db.batch(stmts);
        
        return Response.json({ success: true, orderId, orderNumber, total: subtotal, amountPaid: body.amountPaid, changeAmount });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}
