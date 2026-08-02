"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrders, updateOrderStatus } from "@/actions/orders";
import { useSettings } from "@/components/SettingsProvider";

import {
    Search,
    RefreshCw,
    Check,
    CheckCheck,
    Receipt,
    Printer,
    Loader2,
    Clock,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

const STATUS_CONFIG = {
    new: {
        label: "Baru",
        bg: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        dot: "bg-blue-500",
        action: "Terima",
        actionClass: "bg-blue-500 hover:bg-blue-600 text-white",
        nextStatus: "preparing",
    },
    preparing: {
        label: "Diproses",
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        dot: "bg-amber-500 animate-pulse",
        action: "Siap",
        actionClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
        nextStatus: "ready",
    },
    ready: {
        label: "Siap",
        bg: "bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        icon: Check,
        action: "Selesai",
        actionClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
        nextStatus: "completed",
    },
    completed: {
        label: "Selesai",
        bg: "bg-muted/50",
        text: "text-muted-foreground",
        icon: CheckCheck,
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
        if (result.success) await loadOrders();
        else alert("Error: " + result.error);
        setUpdatingId(null);
    };

    const filteredOrders = orders.filter((order) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return order.orderNumber.toLowerCase().includes(q) || (order.cashier?.name || "").toLowerCase().includes(q);
    });

    const statusCounts = {
        all: orders.length,
        new: orders.filter((o) => o.status === "new").length,
        preparing: orders.filter((o) => o.status === "preparing").length,
        ready: orders.filter((o) => o.status === "ready").length,
        completed: orders.filter((o) => o.status === "completed").length,
    };

    return (
        <div className="flex flex-col min-h-full">
            {/* Header */}
            <div className="px-4 lg:px-6 pt-4 pb-2 space-y-3 bg-background sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-black text-foreground">Pesanan</h1>
                    <Button variant="ghost" size="icon" onClick={loadOrders} className="size-8 rounded-full">
                        <RefreshCw className="size-4" />
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Cari pesanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 h-10 bg-muted/50 border-0 rounded-xl text-sm"
                    />
                </div>
            </div>

            {/* Status Tabs */}
            <div className="px-4 lg:px-6 py-2 bg-background sticky top-[108px] z-10">
                <ScrollArea className="w-full">
                    <div className="flex gap-1.5 pb-1">
                        {[{ key: null, label: "Semua", count: statusCounts.all }, ...Object.entries(STATUS_CONFIG).map(([key, c]) => ({ key, label: c.label, count: statusCounts[key] || 0 }))].map((tab) => (
                            <button
                                key={tab.key ?? "all"}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${statusFilter === tab.key
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[10px] tabular-nums ${statusFilter === tab.key ? "opacity-80" : "opacity-60"}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
            </div>

            {/* Order Cards */}
            <div className="flex-1 px-4 lg:px-6 pb-4 space-y-2.5">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Receipt className="size-10 opacity-20 mb-3" />
                        <p className="text-sm font-medium">Belum ada pesanan</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const config = STATUS_CONFIG[order.status];
                        const isCompleted = order.status === "completed";
                        const Icon = config.icon;

                        return (
                            <div
                                key={order.id}
                                className={`bg-card rounded-2xl border border-border/60 p-4 transition-all ${isCompleted ? "opacity-60" : ""}`}
                            >
                                {/* Top row: order number + status + time */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-foreground">#{order.orderNumber}</span>
                                        <Badge variant="secondary" className={`gap-1 px-2 py-0.5 font-bold text-[10px] border-0 rounded-full ${config.bg} ${config.text}`}>
                                            {config.dot && <span className={`size-1.5 rounded-full ${config.dot}`}></span>}
                                            {Icon && <Icon className="size-3" />}
                                            {config.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="size-3" />
                                        {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "numeric", minute: "2-digit" })}
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-1 mb-3">
                                    {order.items?.slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{item.quantity}x {item.productName}</span>
                                            <span className="font-medium tabular-nums">{formatRupiah(item.subtotal)}</span>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <p className="text-xs text-muted-foreground">+{order.items.length - 3} item lainnya</p>
                                    )}
                                </div>

                                {/* Bottom: total + action */}
                                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                    <div>
                                        <span className="text-xs text-muted-foreground">Total</span>
                                        <p className="text-base font-black text-foreground tabular-nums">{formatRupiah(order.total)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isCompleted && (
                                            <Button variant="outline" size="sm" onClick={() => setReceiptOrder(order)} className="h-8 px-3 text-xs font-bold rounded-xl">
                                                <Receipt className="size-3 mr-1.5" />
                                                Struk
                                            </Button>
                                        )}
                                        {config.action && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleUpdateStatus(order.id, config.nextStatus)}
                                                disabled={updatingId === order.id}
                                                className={`h-8 px-4 text-xs font-bold rounded-xl ${config.actionClass}`}
                                            >
                                                {updatingId === order.id ? <Loader2 className="size-3 animate-spin" /> : config.action}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Receipt Modal */}
            <Dialog open={!!receiptOrder} onOpenChange={(open) => { if (!open) setReceiptOrder(null); }}>
                <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-card border-border rounded-2xl">
                    <DialogHeader className="p-0 border-b-0 space-y-0">
                        <DialogTitle className="sr-only">Struk Pesanan</DialogTitle>
                    </DialogHeader>
                    {receiptOrder && (
                        <>
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-black text-foreground">Struk Pesanan</h3>
                                <p className="text-muted-foreground text-xs font-mono mt-1">#{receiptOrder.orderNumber}</p>

                                <div className="border-t border-dashed border-border mt-4 pt-4 space-y-1.5 text-left">
                                    {receiptOrder.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{item.quantity}x {item.productName}</span>
                                            <span className="font-bold tabular-nums">{formatRupiah(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-border mt-4 pt-3 text-left space-y-1">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm text-muted-foreground">Total</span>
                                        <span className="text-lg font-black tabular-nums">{formatRupiah(receiptOrder.total)}</span>
                                    </div>
                                    {receiptOrder.amountPaid && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Dibayar</span>
                                                <span className="font-bold tabular-nums">{formatRupiah(receiptOrder.amountPaid)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Kembalian</span>
                                                <span className="text-emerald-600 dark:text-emerald-400 font-black tabular-nums">{formatRupiah(receiptOrder.changeAmount)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-dashed border-border text-[11px] text-muted-foreground">
                                    <p>{receiptOrder.paymentMethod?.toUpperCase()} &middot; {new Date(receiptOrder.createdAt).toLocaleString("id-ID")}</p>
                                    <p className="mt-2 font-semibold text-card-foreground text-xs">
                                        {receiptFooter || `Terima kasih sudah berkunjung di ${storeName || "Kael Cafe"}`}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-border flex gap-2 bg-muted/30">
                                <Button variant="outline" onClick={() => window.print()} className="flex-1 h-10 rounded-xl font-bold">
                                    <Printer className="size-4 mr-2" />
                                    Print
                                </Button>
                                <Button onClick={() => setReceiptOrder(null)} className="flex-1 h-10 rounded-xl font-bold">
                                    Tutup
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
