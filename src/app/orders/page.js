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
    CheckCircle2,
    Loader2
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

const STATUS_CONFIG = {
    new: {
        label: "New",
        variant: "default",
        customClass: "bg-blue-500 hover:bg-blue-600 text-white",
        dot: "bg-white",
        action: "Accept",
        actionBtnVariant: "outline",
        actionBtnClass: "text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground",
        nextStatus: "preparing",
    },
    preparing: {
        label: "Preparing",
        variant: "secondary",
        customClass: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
        dot: "bg-amber-500 animate-pulse",
        action: "Mark Ready",
        actionBtnVariant: "outline",
        actionBtnClass: "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
        nextStatus: "ready",
    },
    ready: {
        label: "Ready",
        variant: "secondary",
        customClass: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
        icon: Check,
        action: "Complete",
        actionBtnVariant: "secondary",
        actionBtnClass: "text-muted-foreground",
        nextStatus: "completed",
    },
    completed: {
        label: "Completed",
        variant: "outline",
        customClass: "text-muted-foreground",
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
        <main className="flex-1 flex flex-col bg-background overflow-y-auto">
            <header className="px-4 pl-14 lg:px-8 py-4 lg:py-6 bg-card border-b border-border sticky top-0 z-10 flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                        Order Management
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                        Track and manage incoming cafe orders.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by Order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-muted/50 border-transparent rounded-lg text-sm focus-visible:ring-primary sm:w-64 lg:w-80"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={loadOrders}
                        className="flex items-center gap-2 rounded-lg font-medium shadow-sm bg-background border-border"
                    >
                        <RefreshCw className="size-4" />
                        Refresh
                    </Button>
                </div>
            </header>

            <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Status Tabs */}
                <ScrollArea className="w-full mb-6 pb-2">
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === null ? "default" : "outline"}
                            onClick={() => setStatusFilter(null)}
                            className={`rounded-xl font-bold px-6 h-11 border-border ${statusFilter === null ? "shadow-md bg-primary text-primary-foreground" : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                        >
                            All Orders ({statusCounts.all})
                        </Button>
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <Button
                                key={key}
                                variant={statusFilter === key ? "default" : "outline"}
                                onClick={() => setStatusFilter(key)}
                                className={`rounded-xl font-bold px-6 h-11 border-border ${statusFilter === key ? "shadow-md bg-primary text-primary-foreground" : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                            >
                                {config.label} ({statusCounts[key] || 0})
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>

                {/* Orders Table */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="font-semibold text-muted-foreground h-12 uppercase text-xs tracking-wider">Order ID</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12 uppercase text-xs tracking-wider">Items</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12 uppercase text-xs tracking-wider">Total</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12 uppercase text-xs tracking-wider">Payment</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12 uppercase text-xs tracking-wider">Time</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12 uppercase text-xs tracking-wider">Status</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12 uppercase text-xs tracking-wider text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <Loader2 className="size-8 animate-spin text-primary mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                                            <Receipt className="size-10 mb-2 block mx-auto opacity-50" />
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const config = STATUS_CONFIG[order.status];
                                        const isCompleted = order.status === "completed";
                                        const Icon = config.icon;

                                        return (
                                            <TableRow
                                                key={order.id}
                                                className={`hover:bg-muted/50 border-border transition-colors group ${isCompleted ? "opacity-75" : ""}`}
                                            >
                                                <TableCell className="font-bold text-foreground">
                                                    #{order.orderNumber}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {order.items?.slice(0, 2).map((item) => `${item.quantity}× ${item.productName}`).join(", ")}
                                                        {order.items?.length > 2 && "..."}
                                                    </p>
                                                    <p className="text-xs text-primary font-bold mt-0.5">
                                                        {order.items?.length || 0} items
                                                    </p>
                                                </TableCell>
                                                <TableCell className="font-bold text-foreground">
                                                    {formatRupiah(order.total)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="uppercase font-bold text-[10px] bg-muted text-muted-foreground">
                                                        {order.paymentMethod}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground font-medium">
                                                    {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={config.variant} className={`gap-1.5 px-2.5 py-1 font-bold uppercase text-[10px] border-0 ${config.customClass}`}>
                                                        {config.dot && <span className={`size-1.5 rounded-full ${config.dot}`}></span>}
                                                        {Icon && <Icon className="size-3" />}
                                                        {config.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        {config.action && (
                                                            <Button
                                                                size="sm"
                                                                variant={config.actionBtnVariant}
                                                                onClick={() => handleUpdateStatus(order.id, config.nextStatus)}
                                                                disabled={updatingId === order.id}
                                                                className={`h-8 px-3 text-xs font-bold rounded-lg ${config.actionBtnClass}`}
                                                            >
                                                                {updatingId === order.id ? <Loader2 className="size-3 animate-spin" /> : config.action}
                                                            </Button>
                                                        )}
                                                        {isCompleted && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => setReceiptOrder(order)}
                                                                className="size-8 text-muted-foreground hover:text-primary rounded-lg"
                                                                title="View Receipt"
                                                            >
                                                                <Receipt className="size-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium bg-card">
                        <p className="text-center sm:text-left">
                            Showing {filteredOrders.length} of {orders.length} entries
                        </p>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            <Dialog open={!!receiptOrder} onOpenChange={(open) => { if (!open) setReceiptOrder(null); }}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card border-border">
                    <DialogHeader className="p-0 border-b-0 space-y-0">
                        <DialogTitle className="sr-only">Order Receipt</DialogTitle>
                    </DialogHeader>
                    {receiptOrder && (
                        <>
                            <div className="p-8 text-center bg-card print:p-0 print:text-black" id="receipt-content">
                                <h3 className="text-xl font-black text-foreground print:text-black mb-1">
                                    Order Receipt
                                </h3>
                                <p className="text-muted-foreground print:text-black text-sm font-mono mb-6">
                                    #{receiptOrder.orderNumber}
                                </p>

                                <div className="border-t border-dashed border-border print:border-black pt-4 space-y-2 text-left">
                                    {receiptOrder.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground print:text-black font-medium">
                                                {item.quantity}× {item.productName}
                                            </span>
                                            <span className="font-bold text-foreground print:text-black">
                                                {formatRupiah(item.subtotal)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-border print:border-black mt-4 pt-4 space-y-1.5 text-left">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground print:text-black">Subtotal</span>
                                        <span className="font-medium text-foreground print:text-black">{formatRupiah(receiptOrder.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground print:text-black">Tax</span>
                                        <span className="font-medium text-foreground print:text-black">+{formatRupiah(receiptOrder.tax)}</span>
                                    </div>
                                    {receiptOrder.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-500 font-medium print:text-black">Discount</span>
                                            <span className="text-emerald-600 font-medium print:text-black">-{formatRupiah(receiptOrder.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-black pt-3 mt-1 border-t border-border print:border-black print:text-black">
                                        <span>Total</span>
                                        <span className="text-primary print:text-black">{formatRupiah(receiptOrder.total)}</span>
                                    </div>
                                    {receiptOrder.amountPaid && (
                                        <>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-muted-foreground print:text-black font-medium">Dibayar</span>
                                                <span className="font-bold text-foreground print:text-black">{formatRupiah(receiptOrder.amountPaid)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-600 print:text-black font-bold">Kembalian</span>
                                                <span className="text-emerald-600 print:text-black font-black">{formatRupiah(receiptOrder.changeAmount)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-5 pt-4 border-t border-dashed border-border print:border-black text-xs text-muted-foreground print:text-black font-medium">
                                    <p>Payment: {receiptOrder.paymentMethod?.toUpperCase()}</p>
                                    <p className="mt-0.5">{new Date(receiptOrder.createdAt).toLocaleString("id-ID")}</p>
                                    <p className="mt-3 font-bold text-card-foreground print:text-black">
                                        {receiptFooter || `Thank you for visiting ${storeName || 'Kaelcafe'} ☕`}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border flex gap-3 print:hidden bg-muted/20">
                                <Button variant="outline" onClick={() => window.print()} className="flex-1 h-12 rounded-xl font-bold bg-background">
                                    <Printer className="size-4 mr-2" />
                                    Print
                                </Button>
                                <Button onClick={() => setReceiptOrder(null)} className="flex-1 h-12 rounded-xl font-bold">
                                    Close
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </main>
    );
}
