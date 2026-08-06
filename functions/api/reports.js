import { getDb } from "../db.js";
import { orders, orderItems } from "../db_schema/schema.js";
import { and, gte, lt, desc, sql } from "drizzle-orm";

export async function onRequestGet(context) {
    try {
        const db = getDb(context.env);
        const url = new URL(context.request.url);

        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");

        const fromMs = from ? new Date(from + "T00:00:00").getTime() : 0;
        const toMs = to ? new Date(to + "T23:59:59.999").getTime() : Date.now();

        const conditions = [];
        if (from) conditions.push(gte(orders.createdAt, fromMs));
        if (to) conditions.push(lt(orders.createdAt, toMs + 1));

        const orderList = await db.query.orders.findMany({
            with: { items: true },
            where: conditions.length ? and(...conditions) : undefined,
            orderBy: [desc(orders.createdAt)]
        });

        let totalSales = 0;
        let totalItems = 0;
        const paymentBreakdown = {};

        const productMap = {};

        for (const o of orderList) {
            totalSales += o.total;
            totalItems += o.items.reduce((s, i) => s + i.quantity, 0);
            const key = o.paymentMethod || "cash";
            paymentBreakdown[key] = (paymentBreakdown[key] || 0) + o.total;

            for (const item of o.items) {
                if (!productMap[item.productName]) {
                    productMap[item.productName] = { name: item.productName, quantity: 0, revenue: 0 };
                }
                productMap[item.productName].quantity += item.quantity;
                productMap[item.productName].revenue += item.subtotal;
            }
        }

        const topProducts = Object.values(productMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)
            .map((p, i) => ({ rank: i + 1, ...p }));

        return Response.json({
            success: true,
            summary: {
                totalOrders: orderList.length,
                totalSales,
                totalItems,
                averageOrder: orderList.length ? Math.round(totalSales / orderList.length) : 0,
                paymentBreakdown
            },
            topProducts,
            orders: orderList
        });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}