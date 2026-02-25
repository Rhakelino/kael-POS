"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardStats, getTopItems } from "@/actions/analytics";
import { getOrders } from "@/actions/orders";
import Link from "next/link";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

const STATUS_BADGE = {
    new: "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-emerald-100 text-emerald-700",
    completed: "bg-slate-100 text-slate-500",
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [topItems, setTopItems] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const [statsResult, topResult, ordersResult] =
            await Promise.all([
                getDashboardStats(),
                getTopItems(5),
                getOrders({}),
            ]);
        if (statsResult.success) setStats(statsResult.data);
        if (topResult.success) setTopItems(topResult.data);
        if (ordersResult.success) setRecentOrders(ordersResult.data.slice(0, 5));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    return (
        <main className="flex-1 flex flex-col overflow-y-auto">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-4 pl-14 lg:px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="flex items-center gap-2 lg:gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        <span className="material-symbols-outlined text-primary text-sm">
                            wb_sunny
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                            Active Shift
                        </span>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                        {today}
                    </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-4">
                    <button
                        onClick={loadData}
                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <span className="material-symbols-outlined">
                            refresh
                        </span>
                    </button>
                    <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative">
                        <span className="material-symbols-outlined">
                            notifications
                        </span>
                    </button>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-[1400px] mx-auto w-full">
                {/* Hero */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                            Dashboard Overview
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm lg:text-base">
                            Track your cafe&apos;s live performance.
                        </p>
                    </div>
                </div>

                {/* Metric Cards */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <div className="bg-white p-5 lg:p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">
                                        payments
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                Total Sales
                            </p>
                            <p className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
                                {formatRupiah(stats?.totalRevenue || 0)}
                            </p>
                        </div>
                        <div className="bg-white p-5 lg:p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <span className="material-symbols-outlined">
                                        receipt_long
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                Completed Orders
                            </p>
                            <p className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
                                {stats?.orderCount || 0}
                            </p>
                        </div>
                        <div className="bg-white p-5 lg:p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                    <span className="material-symbols-outlined">
                                        pending_actions
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                Pending Orders
                            </p>
                            <p className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
                                {stats?.pendingOrders || 0}
                            </p>
                        </div>
                        <div className="bg-white p-5 lg:p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <span className="material-symbols-outlined">
                                        restaurant_menu
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                Active Products
                            </p>
                            <p className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
                                {stats?.activeProducts || 0}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Recent Orders Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 lg:p-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-base lg:text-lg font-bold">
                                Recent Orders
                            </h3>
                            <Link
                                href="/orders"
                                className="text-sm text-primary font-bold hover:underline"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <th className="px-4 lg:px-6 py-4">
                                            Order ID
                                        </th>
                                        <th className="px-4 lg:px-6 py-4">
                                            Items
                                        </th>
                                        <th className="px-4 lg:px-6 py-4">
                                            Status
                                        </th>
                                        <th className="px-4 lg:px-6 py-4">
                                            Time
                                        </th>
                                        <th className="px-4 lg:px-6 py-4">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-8 text-center text-slate-400 text-sm"
                                            >
                                                No orders yet. Go to Cashier to
                                                create one!
                                            </td>
                                        </tr>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                                    #{order.orderNumber}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {order.items
                                                        ?.slice(0, 2)
                                                        .map(
                                                            (i) =>
                                                                `${i.quantity}× ${i.productName}`
                                                        )
                                                        .join(", ")}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_BADGE[
                                                            order.status
                                                            ] ||
                                                            STATUS_BADGE.completed
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleTimeString(
                                                        "en-US",
                                                        {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold">
                                                    {formatRupiah(order.total)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Popular Items */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">
                            Top Selling Items
                        </h3>
                        <div className="space-y-4">
                            {topItems.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">
                                    No sales data yet
                                </p>
                            ) : (
                                topItems.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">
                                                {item.productName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {item.totalQuantity} sold
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">
                                                {formatRupiah(
                                                    item.totalRevenue
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Link
                            href="/menu"
                            className="block w-full mt-6 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors text-center"
                        >
                            View Menu
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
