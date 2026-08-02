"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, sql, gte, lte, and, desc } from "drizzle-orm";

function getStartOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getEndOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

export async function getDailySales(dateStr = null) {
    try {
        const date = dateStr ? new Date(dateStr) : new Date();
        const startOfDay = getStartOfDay(date);
        const endOfDay = getEndOfDay(date);

        const result = db
            .select({
                totalSales: sql`COALESCE(SUM(${orders.total}), 0)`.as("total_sales"),
                orderCount: sql`COUNT(*)`.as("order_count"),
                avgOrderValue:
                    sql`COALESCE(AVG(${orders.total}), 0)`.as("avg_order_value"),
            })
            .from(orders)
            .where(
                and(
                    eq(orders.status, "completed"),
                    gte(orders.createdAt, startOfDay),
                    lte(orders.createdAt, endOfDay)
                )
            )
            .get();

        return {
            success: true,
            data: {
                totalSales: result?.totalSales || 0,
                orderCount: result?.orderCount || 0,
                avgOrderValue: result?.avgOrderValue || 0,
                date: date.toISOString().split("T")[0],
            },
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getTopItems(limit = 5, days = 7) {
    try {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const result = db
            .select({
                productId: orderItems.productId,
                productName: orderItems.productName,
                totalQuantity: sql`SUM(${orderItems.quantity})`.as("total_quantity"),
                totalRevenue: sql`SUM(${orderItems.subtotal})`.as("total_revenue"),
            })
            .from(orderItems)
            .innerJoin(orders, eq(orderItems.orderId, orders.id))
            .where(
                and(
                    eq(orders.status, "completed"),
                    gte(orders.createdAt, since)
                )
            )
            .groupBy(orderItems.productId, orderItems.productName)
            .orderBy(desc(sql`total_quantity`))
            .limit(limit)
            .all();

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getHourlyPerformance(dateStr = null) {
    try {
        const date = dateStr ? new Date(dateStr) : new Date();
        const startOfDay = getStartOfDay(date);
        const endOfDay = getEndOfDay(date);

        const result = db
            .select({
                hour: sql`strftime('%H', datetime(${orders.createdAt} / 1000, 'unixepoch', 'localtime'))`.as(
                    "hour"
                ),
                totalSales: sql`COALESCE(SUM(${orders.total}), 0)`.as("total_sales"),
                orderCount: sql`COUNT(*)`.as("order_count"),
            })
            .from(orders)
            .where(
                and(
                    eq(orders.status, "completed"),
                    gte(orders.createdAt, startOfDay),
                    lte(orders.createdAt, endOfDay)
                )
            )
            .groupBy(sql`hour`)
            .orderBy(sql`hour`)
            .all();

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getDashboardStats() {
    try {
        // Today's stats
        const todayStart = getStartOfDay();
        const todayEnd = getEndOfDay();

        const todayStats = db
            .select({
                totalRevenue:
                    sql`COALESCE(SUM(${orders.total}), 0)`.as("total_revenue"),
                orderCount: sql`COUNT(*)`.as("order_count"),
                avgOrderValue:
                    sql`COALESCE(AVG(${orders.total}), 0)`.as("avg_order_value"),
            })
            .from(orders)
            .where(
                and(
                    eq(orders.status, "completed"),
                    gte(orders.createdAt, todayStart),
                    lte(orders.createdAt, todayEnd)
                )
            )
            .get();

        // Active products count
        const productCount = db
            .select({
                count: sql`COUNT(*)`.as("count"),
            })
            .from(products)
            .where(eq(products.isActive, true))
            .get();

        // Pending orders
        const pendingOrders = db
            .select({
                count: sql`COUNT(*)`.as("count"),
            })
            .from(orders)
            .where(
                sql`${orders.status} IN ('new', 'preparing', 'ready')`
            )
            .get();

        return {
            success: true,
            data: {
                totalRevenue: todayStats?.totalRevenue || 0,
                orderCount: todayStats?.orderCount || 0,
                avgOrderValue: todayStats?.avgOrderValue || 0,
                activeProducts: productCount?.count || 0,
                pendingOrders: pendingOrders?.count || 0,
            },
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getSalesChart(days = 7) {
    try {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const result = db
            .select({
                date: sql`strftime('%Y-%m-%d', datetime(${orders.createdAt} / 1000, 'unixepoch', 'localtime'))`.as(
                    "date"
                ),
                totalSales: sql`COALESCE(SUM(${orders.total}), 0)`.as("total_sales"),
                orderCount: sql`COUNT(*)`.as("order_count"),
            })
            .from(orders)
            .where(
                and(
                    eq(orders.status, "completed"),
                    gte(orders.createdAt, since)
                )
            )
            .groupBy(sql`date`)
            .orderBy(sql`date`)
            .all();

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
