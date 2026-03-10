"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardStats, getTopItems } from "@/actions/analytics";
import { getOrders } from "@/actions/orders";
import Link from "next/link";
import {
    Sun,
    RefreshCw,
    Bell,
    Banknote,
    ReceiptText,
    Clock,
    UtensilsCrossed,
    Trophy
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

const getStatusBadge = (status) => {
    switch (status) {
        case 'new':
            return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
        case 'preparing':
            return <Badge className="bg-amber-500 hover:bg-amber-600">Preparing</Badge>;
        case 'ready':
            return <Badge className="bg-emerald-500 hover:bg-emerald-600">Ready</Badge>;
        case 'completed':
            return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
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
            <header className="h-16 flex items-center justify-between px-4 pl-14 lg:px-8 bg-card border-b border-border sticky top-0 z-10">
                <div className="flex items-center gap-2 lg:gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
                        <Sun className="size-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                            Active Shift
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                        {today}
                    </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-4">
                    <Button variant="ghost" size="icon" onClick={loadData}>
                        <RefreshCw className="size-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Bell className="size-4 text-muted-foreground" />
                    </Button>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-[1400px] mx-auto w-full">
                {/* Hero */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">
                            Dashboard Overview
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm lg:text-base">
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
                        <Card>
                            <CardContent className="p-5 lg:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Banknote className="size-5" />
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Total Sales
                                </p>
                                <p className="text-xl lg:text-2xl font-black text-foreground mt-1">
                                    {formatRupiah(stats?.totalRevenue || 0)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-5 lg:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                        <ReceiptText className="size-5" />
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Completed Orders
                                </p>
                                <p className="text-xl lg:text-2xl font-black text-foreground mt-1">
                                    {stats?.orderCount || 0}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-5 lg:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <Clock className="size-5" />
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Pending Orders
                                </p>
                                <p className="text-xl lg:text-2xl font-black text-foreground mt-1">
                                    {stats?.pendingOrders || 0}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-5 lg:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                        <UtensilsCrossed className="size-5" />
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Active Products
                                </p>
                                <p className="text-xl lg:text-2xl font-black text-foreground mt-1">
                                    {stats?.activeProducts || 0}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Recent Orders Table */}
                    <Card className="lg:col-span-2 shadow-sm overflow-hidden flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between py-4 lg:py-6 border-b border-border bg-card">
                            <CardTitle className="text-base lg:text-lg font-bold">Recent Orders</CardTitle>
                            <Link href="/orders" className="text-sm text-primary font-bold hover:underline">
                                View All
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-bold">Order ID</TableHead>
                                        <TableHead className="font-bold">Items</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold">Time</TableHead>
                                        <TableHead className="font-bold text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No orders yet. Go to Cashier to create one!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <TableRow key={order.id} className="cursor-pointer transition-colors">
                                                <TableCell className="font-bold">
                                                    #{order.orderNumber}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {order.items
                                                        ?.slice(0, 2)
                                                        .map((i) => `${i.quantity}× ${i.productName}`)
                                                        .join(", ")}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(order.status)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-bold text-right">
                                                    {formatRupiah(order.total)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Popular Items */}
                    <Card className="shadow-sm flex flex-col">
                        <CardHeader className="py-4 lg:py-6 bg-card">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Trophy className="size-5 text-amber-500" />
                                Top Selling Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                {topItems.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No sales data yet
                                    </p>
                                ) : (
                                    topItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-sm">
                                                #{i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground">{item.totalQuantity} sold</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">{formatRupiah(item.totalRevenue)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Link href="/menu" className={buttonVariants({ variant: "outline", className: "w-full mt-6" })}>
                                View Menu
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
