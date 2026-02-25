"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrders, updateOrderStatus } from "@/actions/orders";
import { useSettings } from "@/components/SettingsProvider";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

const STATUS_CONFIG = {
    new: {
        label: "New",
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-100",
        dot: "bg-blue-500",
        action: "Accept",
        actionBg: "bg-primary/10 text-primary hover:bg-primary hover:text-white",
        nextStatus: "preparing",
    },
    preparing: {
        label: "Preparing",
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-100",
        dot: "bg-amber-500 animate-pulse",
        action: "Mark Ready",
        actionBg: "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
        nextStatus: "ready",
    },
    ready: {
        label: "Ready",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
        icon: "done",
        action: "Complete",
        actionBg: "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:bg-zinc-800",
        nextStatus: "completed",
    },
    completed: {
        label: "Completed",
        bg: "bg-slate-100 dark:bg-zinc-800",
        text: "text-slate-500 dark:text-zinc-400",
        border: "border-slate-200 dark:border-zinc-800",
        icon: "done_all",
    },
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [receiptOrder, setReceiptOrder] = useState(null);

    const { storeName, receiptFooter } = useSettings();

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        const filters = {};
        if (statusFilter) filters.status = statusFilter;
        const result = await getOrders(filters);
        if (result.success) setOrders(result.data);
        setIsLoading(false);
    }, [statusFilter]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            await loadOrders();
        } else {
            alert("Error: " + result.error);
        }
        setUpdatingId(null);
    };

    const filteredOrders = orders.filter((order) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                order.orderNumber.toLowerCase().includes(q) ||
                (order.cashier?.name || "").toLowerCase().includes(q)
            );
        }
        return true;
    });

    const statusCounts = {
        all: orders.length,
        new: orders.filter((o) => o.status === "new").length,
        preparing: orders.filter((o) => o.status === "preparing").length,
        ready: orders.filter((o) => o.status === "ready").length,
        completed: orders.filter((o) => o.status === "completed").length,
    };

    return (
        <main className="flex-1 flex flex-col bg-slate-50 dark:bg-zinc-900 overflow-y-auto">
            <header className="px-4 pl-14 lg:px-8 py-4 lg:py-6 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Order Management
                    </h2>
                    <p className="text-xs lg:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                        Track and manage incoming cafe orders.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400 text-sm">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search by Order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary sm:w-64 lg:w-80"
                        />
                    </div>
                    <button
                        onClick={loadOrders}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 px-4 py-2 rounded-lg font-medium text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:bg-zinc-900 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            refresh
                        </span>
                        Refresh
                    </button>
                </div>
            </header>

            <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Status Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setStatusFilter(null)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap ${statusFilter === null
                            ? "bg-primary text-white shadow-sm shadow-primary/20"
                            : "bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:bg-zinc-900"
                            }`}
                    >
                        All Orders ({statusCounts.all})
                    </button>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap ${statusFilter === key
                                ? "bg-primary text-white shadow-sm shadow-primary/20"
                                : "bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:bg-zinc-900"
                                }`}
                        >
                            {config.label} ({statusCounts[key] || 0})
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Items</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center text-slate-400 dark:text-zinc-400"
                                        >
                                            <span className="material-symbols-outlined text-4xl mb-2 block">
                                                receipt_long
                                            </span>
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const config =
                                            STATUS_CONFIG[order.status];
                                        const isCompleted =
                                            order.status === "completed";
                                        return (
                                            <tr
                                                key={order.id}
                                                className={`hover:bg-slate-50 dark:bg-zinc-900 transition-colors group ${isCompleted
                                                    ? "opacity-75"
                                                    : ""
                                                    }`}
                                            >
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                    #{order.orderNumber}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">
                                                        {order.items
                                                            ?.slice(0, 2)
                                                            .map(
                                                                (item) =>
                                                                    `${item.quantity}× ${item.productName}`
                                                            )
                                                            .join(", ")}
                                                        {order.items?.length >
                                                            2 && "..."}
                                                    </p>
                                                    <p className="text-xs text-primary font-medium mt-0.5">
                                                        {order.items?.length ||
                                                            0}{" "}
                                                        items
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                    {formatRupiah(order.total)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="uppercase text-xs font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                                        {order.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-zinc-400">
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
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${config.bg} ${config.text} ${config.border} border`}
                                                    >
                                                        {config.dot && (
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                                                            ></span>
                                                        )}
                                                        {config.icon && (
                                                            <span className="material-symbols-outlined text-[14px]">
                                                                {config.icon}
                                                            </span>
                                                        )}
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {config.action && (
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    order.id,
                                                                    config.nextStatus
                                                                )
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                order.id
                                                            }
                                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${config.actionBg} disabled:opacity-50`}
                                                        >
                                                            {updatingId ===
                                                                order.id
                                                                ? "..."
                                                                : config.action}
                                                        </button>
                                                    )}
                                                    {isCompleted && (
                                                        <button
                                                            onClick={() =>
                                                                setReceiptOrder(
                                                                    order
                                                                )
                                                            }
                                                            className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-primary transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                receipt_long
                                                            </span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-zinc-400">
                        <p className="text-center sm:text-left">
                            Showing {filteredOrders.length} of {orders.length}{" "}
                            entries
                        </p>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {receiptOrder && (
                <div onClick={() => setReceiptOrder(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                        <div className="p-8 text-center">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                                Order Receipt
                            </h3>
                            <p className="text-slate-400 dark:text-zinc-400 text-sm font-mono mb-6">
                                #{receiptOrder.orderNumber}
                            </p>

                            <div className="border-t border-dashed border-slate-200 dark:border-zinc-800 pt-4 space-y-2 text-left">
                                {receiptOrder.items?.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-slate-600 dark:text-zinc-400">
                                            {item.quantity}×{" "}
                                            {item.productName}
                                        </span>
                                        <span className="font-bold">
                                            {formatRupiah(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-slate-200 dark:border-zinc-800 mt-4 pt-4 space-y-1 text-left">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-zinc-400">
                                        Subtotal
                                    </span>
                                    <span>
                                        {formatRupiah(receiptOrder.subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-zinc-400">Tax</span>
                                    <span>
                                        +{formatRupiah(receiptOrder.tax)}
                                    </span>
                                </div>
                                {receiptOrder.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-500">
                                            Discount
                                        </span>
                                        <span className="text-emerald-600">
                                            -
                                            {formatRupiah(
                                                receiptOrder.discount
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-black pt-2 border-t border-slate-100 dark:border-zinc-800">
                                    <span>Total</span>
                                    <span className="text-primary">
                                        {formatRupiah(receiptOrder.total)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-400">
                                <p>
                                    Payment:{" "}
                                    {receiptOrder.paymentMethod?.toUpperCase()}
                                </p>
                                <p>
                                    {new Date(
                                        receiptOrder.createdAt
                                    ).toLocaleString("id-ID")}
                                </p>
                                <p className="mt-2 font-bold text-slate-500 dark:text-zinc-400">
                                    {receiptFooter || `Thank you for visiting ${storeName} ☕`}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2 print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-3 bg-slate-100 dark:bg-zinc-800 rounded-xl font-bold text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">print</span>
                                Print
                            </button>
                            <button
                                onClick={() => setReceiptOrder(null)}
                                className="flex-1 py-3 bg-primary rounded-xl font-bold text-sm text-white hover:bg-primary/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
