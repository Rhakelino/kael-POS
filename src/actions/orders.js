"use server";

import { db } from "@/lib/db";
import {
    orders,
    orderItems,
    products,
} from "@/db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

function generateOrderNumber() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `ORD-${dateStr}-${random}`;
}

export async function createOrder({
    items,
    paymentMethod = "cash",
    taxEnabled = true,
    discountCode = null,
    notes = null,
    cashierId = null,
}) {
    try {
        const orderNumber = generateOrderNumber();

        // Calculate subtotal from items
        let subtotal = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await db.query.products.findFirst({
                where: eq(products.id, item.productId),
            });

            if (!product) {
                return { success: false, error: `Product not found: ${item.productId}` };
            }

            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;

            orderItemsData.push({
                id: crypto.randomUUID(),
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal: itemSubtotal,
                notes: item.notes || null,
            });
        }

        // Calculate tax and discount
        const tax = taxEnabled ? Math.round(subtotal * 0.1) : 0;
        let discount = 0;
        if (discountCode === "CODE10") {
            discount = Math.round(subtotal * 0.1);
        }
        const total = subtotal + tax - discount;

        // Use a transaction to insert both order and items
        const orderId = crypto.randomUUID();
        const now = new Date();

        const sqlite = db.$client;
        const transaction = sqlite.transaction(() => {
            db.insert(orders)
                .values({
                    id: orderId,
                    orderNumber,
                    subtotal,
                    tax,
                    discount,
                    total,
                    paymentMethod,
                    status: "new",
                    cashierId,
                    notes,
                    createdAt: now,
                    updatedAt: now,
                })
                .run();

            for (const item of orderItemsData) {
                db.insert(orderItems)
                    .values({
                        ...item,
                        orderId,
                    })
                    .run();
            }
        });

        transaction();

        return { success: true, orderId, orderNumber, total };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getOrders(filters = {}) {
    try {
        const conditions = [];

        if (filters.status) {
            conditions.push(eq(orders.status, filters.status));
        }

        if (filters.dateFrom) {
            conditions.push(gte(orders.createdAt, new Date(filters.dateFrom)));
        }

        if (filters.dateTo) {
            conditions.push(lte(orders.createdAt, new Date(filters.dateTo)));
        }

        const result = await db.query.orders.findMany({
            where: conditions.length > 0
                ? (fields, { and: andFn }) => andFn(...conditions)
                : undefined,
            with: {
                items: true,
                cashier: {
                    columns: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [desc(orders.createdAt)],
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getOrderById(orderId) {
    try {
        const result = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
            with: {
                items: {
                    with: {
                        product: true,
                    },
                },
                cashier: {
                    columns: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!result) return { success: false, error: "Order not found" };
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

const STATUS_TRANSITIONS = {
    new: "preparing",
    preparing: "ready",
    ready: "completed",
};

export async function updateOrderStatus(orderId, newStatus) {
    try {
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
        });

        if (!order) return { success: false, error: "Order not found" };

        // Validate status transition
        const expectedNext = STATUS_TRANSITIONS[order.status];
        if (expectedNext !== newStatus) {
            return {
                success: false,
                error: `Invalid status transition: ${order.status} → ${newStatus}. Expected: ${expectedNext}`,
            };
        }

        await db
            .update(orders)
            .set({
                status: newStatus,
                updatedAt: new Date(),
            })
            .where(eq(orders.id, orderId));

        return { success: true, status: newStatus };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function cancelOrder(orderId) {
    try {
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
        });

        if (!order) return { success: false, error: "Order not found" };

        await db
            .update(orders)
            .set({
                status: "cancelled",
                updatedAt: new Date(),
            })
            .where(eq(orders.id, orderId));

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

