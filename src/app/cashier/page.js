"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories, getProducts } from "@/actions/products";
import { createOrder, cancelOrder } from "@/actions/orders";
import { useSettings } from "@/components/SettingsProvider";

import {
    Clock as ClockIcon,
    Bell,
    Search,
    SearchX,
    Coffee,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    CheckCircle2,
    Printer,
    XCircle,
    Wallet,
    Banknote
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    const formatted = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    const dateStr = time.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    return `${formatted} | ${dateStr}`;
}

export default function Cashier() {
    const [categories, setCategories] = useState([]);
    const [products, setProductsList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [taxEnabled, setTaxEnabled] = useState(true);
    const [discountCode, setDiscountCode] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReceipt, setShowReceipt] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState("");

    const { storeName, autoPrint, receiptFooter, taxRates, paymentMethods } = useSettings();
    const standardTaxRate = taxRates?.[0]?.rate || 10;
    const activePaymentMethods = paymentMethods?.filter(pm => pm.active) || [];

    useEffect(() => {
        if (activePaymentMethods.length > 0 && !activePaymentMethods.find(p => p.id === paymentMethod)) {
            setPaymentMethod(activePaymentMethods[0].id);
        }
    }, [activePaymentMethods, paymentMethod]);

    useEffect(() => {
        if (showReceipt && autoPrint) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [showReceipt, autoPrint]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const [catResult, prodResult] = await Promise.all([
            getCategories(),
            getProducts(selectedCategory),
        ]);
        if (catResult.success) setCategories(catResult.data);
        if (prodResult.success) setProductsList(prodResult.data);
        setIsLoading(false);
    }, [selectedCategory]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = (product) => {
        if (!product.isActive) return;
        setCart((prev) => {
            const existing = prev.find((item) => item.productId === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    notes: "",
                },
            ];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + delta }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
    };

    const resetCart = () => {
        setCart([]);
        setDiscountCode("");
        setAmountPaid("");
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = taxEnabled ? Math.round(subtotal * (standardTaxRate / 100)) : 0;
    const discount = discountCode.toUpperCase() === "KING EMYU" ? Math.round(subtotal * 0.5) : 0;
    const total = subtotal + tax - discount;

    const parsedAmountPaid = Number(amountPaid) || 0;
    const changeAmount = parsedAmountPaid - total;
    const isCash = paymentMethod === "cash";
    const cashValid = !isCash || (parsedAmountPaid >= total && parsedAmountPaid > 0);

    // Generate smart quick-amount suggestions
    const getQuickAmounts = () => {
        if (total <= 0) return [];
        const amounts = [total]; // Uang Pas
        const denominations = [10000, 20000, 50000, 100000, 150000, 200000, 500000];
        for (const d of denominations) {
            const rounded = Math.ceil(total / d) * d;
            if (rounded > total && !amounts.includes(rounded)) {
                amounts.push(rounded);
            }
        }
        return amounts.slice(0, 5);
    };

    const handlePayNow = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        try {
            const result = await createOrder({
                items: cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    notes: item.notes,
                })),
                paymentMethod,
                taxEnabled,
                discountCode: discountCode || null,
                notes: null,
                amountPaid: isCash ? parsedAmountPaid : null,
            });

            if (result.success) {
                setShowReceipt({
                    orderId: result.orderId,
                    orderNumber: result.orderNumber,
                    items: [...cart],
                    subtotal,
                    tax,
                    discount,
                    total: result.total,
                    paymentMethod,
                    amountPaid: result.amountPaid,
                    changeAmount: result.changeAmount,
                    date: new Date(),
                });
                setCart([]);
                setAmountPaid("");
                setDiscountCode("");
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            alert("Failed to create order: " + error.message);
        }
        setIsSubmitting(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 flex flex-col h-full min-w-0 bg-background">
            {/* Header */}
            <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 pl-14 lg:px-6 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 pointer-events-none gap-1.5 px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider">Shift Open</span>
                    </Badge>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <ClockIcon className="size-5" />
                        <span className="text-sm">
                            <LiveClock />
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="size-5 text-muted-foreground" />
                    </Button>
                </div>
            </header>

            {/* POS Body */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Left: Product Menu */}
                <div className="w-full lg:w-[60%] flex-1 flex flex-col bg-muted/30 lg:border-r border-border overflow-hidden">
                    {/* Search & Tabs */}
                    <div className="p-6 pb-0 space-y-6">
                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                            <Input
                                className="w-full pl-12 pr-4 py-6 bg-card border-border rounded-xl focus-visible:ring-primary/20 shadow-sm text-base"
                                placeholder="Search menu items..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <ScrollArea className="w-full border-b border-border pb-1">
                            <div className="flex items-center w-max p-1 space-x-2">
                                <Button
                                    variant={selectedCategory === null ? "default" : "ghost"}
                                    onClick={() => setSelectedCategory(null)}
                                    className={`rounded-full px-6 transition-all ${selectedCategory === null ? "shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    All
                                </Button>
                                {categories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant={selectedCategory === cat.id ? "default" : "ghost"}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`rounded-full px-6 transition-all ${selectedCategory === cat.id ? "shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                <SearchX className="size-10 mb-2 opacity-50" />
                                <p className="text-sm font-medium">No products found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map((product) => {
                                    const inCart = cart.find((item) => item.productId === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            className={`bg-card p-3 rounded-xl border transition-all shadow-sm relative select-none ${!product.isActive
                                                ? "border-border opacity-60 grayscale cursor-not-allowed"
                                                : inCart
                                                    ? "border-primary ring-2 ring-primary/20 cursor-pointer"
                                                    : "border-border hover:border-primary/50 hover:shadow-md cursor-pointer group"
                                                }`}
                                        >
                                            <div
                                                className="aspect-square rounded-lg mb-3 bg-center bg-cover bg-muted overflow-hidden relative"
                                                style={{ backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined }}
                                            >
                                                {product.isActive ? (
                                                    <Badge className="absolute top-2 right-2 text-[10px] uppercase font-bold bg-emerald-500 hover:bg-emerald-600 border-0 pointer-events-none text-white!">
                                                        Available
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="absolute top-2 right-2 text-[10px] uppercase font-bold border-0 pointer-events-none">
                                                        Sold Out
                                                    </Badge>
                                                )}
                                                {!product.imageUrl && (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Coffee className="size-10 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-card-foreground line-clamp-1" title={product.name}>
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className={`font-bold text-sm ${product.isActive ? "text-primary" : "text-muted-foreground"}`}>
                                                    {formatRupiah(product.price)}
                                                </p>
                                                {inCart && (
                                                    <Badge className="bg-primary text-primary-foreground font-bold px-2 rounded-full pointer-events-none">
                                                        ×{inCart.quantity}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="w-full lg:w-[40%] h-[45vh] min-h-[400px] lg:h-full lg:min-h-0 flex flex-col bg-card border-t lg:border-t-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] lg:shadow-none z-10 overflow-hidden shrink-0">
                    <div className="px-5 py-4 flex items-center justify-between border-b border-border bg-muted/20">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="size-4 text-primary" />
                            <h2 className="text-sm font-bold text-foreground">Current Order</h2>
                        </div>
                        <Badge variant="secondary" className="font-mono text-[10px]">
                            {cart.length} items
                        </Badge>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <div className="p-4 rounded-full bg-muted/50 mb-3">
                                    <ShoppingCart className="size-8 opacity-50" />
                                </div>
                                <p className="text-sm font-medium">Cart is empty</p>
                                <p className="text-xs opacity-70 mt-1">Click a product to add it</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.productId} className="px-3 py-3 bg-muted/40 rounded-xl border border-border group transition-colors hover:bg-muted/60">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="min-w-0 flex-1 pr-2">
                                            <h4 className="text-sm font-bold truncate text-foreground">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground">{formatRupiah(item.price)} each</p>
                                        </div>
                                        <span className="text-sm font-bold whitespace-nowrap text-foreground">{formatRupiah(item.price * item.quantity)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => updateQuantity(item.productId, -1)}>
                                                <Minus className="size-3" />
                                            </Button>
                                            <span className="text-xs font-bold w-6 text-center select-none">{item.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-primary" onClick={() => updateQuantity(item.productId, 1)}>
                                                <Plus className="size-3" />
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg" onClick={() => removeFromCart(item.productId)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Checkout Section - Compact */}
                    <div className="px-5 py-4 border-t border-border bg-card shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-20 space-y-4 shrink-0">
                        {/* Summary & Toggles */}
                        <div className="space-y-2 bg-muted/30 p-3.5 rounded-xl border border-border/50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Subtotal</span>
                                <span className="font-bold text-foreground">{formatRupiah(subtotal)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <Switch id="tax-switch" checked={taxEnabled} onCheckedChange={setTaxEnabled} className="scale-75 origin-left" />
                                    <Label htmlFor="tax-switch" className="text-muted-foreground cursor-pointer text-xs">Tax ({standardTaxRate}%)</Label>
                                </div>
                                {taxEnabled && <span className="text-foreground text-xs font-medium">+{formatRupiah(tax)}</span>}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="discount" className="text-muted-foreground text-xs font-medium whitespace-nowrap">Discount</Label>
                                    <Input
                                        id="discount"
                                        className="h-7 w-28 px-2 text-xs font-bold text-primary placeholder:text-muted-foreground/50 border-border/50 bg-background focus-visible:ring-primary/20 transition-all rounded-md"
                                        placeholder="CODE"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                    />
                                </div>
                                {discount > 0 && <span className="text-emerald-600 font-bold text-xs">-{formatRupiah(discount)}</span>}
                            </div>
                        </div>

                        {/* Payment Selection & Action */}
                        <div className="space-y-3">
                            {/* Payment Methods */}
                            <div className="flex gap-2">
                                {activePaymentMethods.map((method) => (
                                    <Button
                                        key={method.id}
                                        variant={paymentMethod === method.id ? "default" : "outline"}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex-1 h-9 text-[11px] font-bold uppercase rounded-lg transition-all ${paymentMethod === method.id ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "bg-background border-border/60 text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {method.name}
                                    </Button>
                                ))}
                            </div>

                            {/* Cash Payment Input */}
                            {isCash && cart.length > 0 && (
                                <div className="space-y-2 bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Banknote className="size-4 text-amber-600" />
                                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Cash Payment</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">Rp</span>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={amountPaid}
                                            onChange={(e) => setAmountPaid(e.target.value)}
                                            className="pl-10 pr-4 h-11 text-lg font-black text-foreground bg-background border-border/50 rounded-lg focus-visible:ring-amber-500/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {getQuickAmounts().map((amount, i) => (
                                            <Button
                                                key={amount}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setAmountPaid(String(amount))}
                                                className={`h-7 px-2.5 text-[11px] font-bold rounded-lg transition-all ${parsedAmountPaid === amount
                                                        ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:text-white"
                                                        : "bg-background border-border/60 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-700 hover:border-amber-500/30"
                                                    }`}
                                            >
                                                {i === 0 ? "Uang Pas" : formatRupiah(amount)}
                                            </Button>
                                        ))}
                                    </div>
                                    {parsedAmountPaid > 0 && (
                                        <div className={`flex justify-between items-center p-2.5 rounded-lg mt-1 ${changeAmount >= 0
                                                ? "bg-emerald-500/10 border border-emerald-500/20"
                                                : "bg-destructive/10 border border-destructive/20"
                                            }`}>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${changeAmount >= 0 ? "text-emerald-600" : "text-destructive"
                                                }`}>
                                                {changeAmount >= 0 ? "Kembalian" : "Kurang"}
                                            </span>
                                            <span className={`text-lg font-black ${changeAmount >= 0 ? "text-emerald-600" : "text-destructive"
                                                }`}>
                                                {formatRupiah(Math.abs(changeAmount))}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2 items-center">
                                <div className="bg-muted/30 p-2 px-4 rounded-xl border border-border/50 flex flex-col justify-center flex-1 h-12">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Pay</span>
                                        <span className="text-xl font-black text-primary leading-none">{formatRupiah(total)}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={resetCart}
                                    className="h-12 aspect-square p-0 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border-border/50 shrink-0 transition-colors"
                                    title="Reset Cart"
                                >
                                    <Trash2 className="size-5" />
                                </Button>
                            </div>

                            <Button
                                onClick={handlePayNow}
                                disabled={cart.length === 0 || isSubmitting || !cashValid}
                                className="w-full h-12 rounded-xl text-md font-black shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transition-all active:scale-[0.98] uppercase tracking-wide disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Wallet className="size-5 mr-2" />
                                        Charge Amount
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Receipt Modal */}
            <Dialog open={!!showReceipt} onOpenChange={(open) => { if (!open) setShowReceipt(null); }}>
                <DialogContent className="sm:max-w-md bg-card p-0 overflow-hidden border-border gap-0" id="receipt-modal-content">
                    <DialogHeader className="p-0 border-b-0 space-y-0">
                        <DialogTitle className="sr-only">Receipt Payment Successful</DialogTitle>
                    </DialogHeader>
                    {showReceipt && (
                        <>
                            <div className="p-8 text-center bg-card print:p-0 print:text-black" id="receipt-content">
                                <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 print:hidden">
                                    <CheckCircle2 className="size-8 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground print:text-black mb-1 mt-2">
                                    Payment Successful!
                                </h3>
                                <p className="text-muted-foreground print:text-black text-sm font-mono mb-6">
                                    Order #{showReceipt.orderNumber}
                                </p>

                                <div className="border-t border-dashed border-border print:border-black pt-4 space-y-2 text-left">
                                    {showReceipt.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground print:text-black font-medium">
                                                {item.quantity}× {item.name}
                                            </span>
                                            <span className="font-bold text-foreground print:text-black">
                                                {formatRupiah(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-border print:border-black mt-4 pt-4 space-y-1.5 text-left">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground print:text-black">Subtotal</span>
                                        <span className="font-medium text-foreground print:text-black">{formatRupiah(showReceipt.subtotal)}</span>
                                    </div>
                                    {showReceipt.tax > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground print:text-black">Tax</span>
                                            <span className="font-medium text-foreground print:text-black">+{formatRupiah(showReceipt.tax)}</span>
                                        </div>
                                    )}
                                    {showReceipt.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-500 print:text-black font-medium">Discount</span>
                                            <span className="text-emerald-600 print:text-black font-medium">-{formatRupiah(showReceipt.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-black pt-3 mt-1 border-t border-border print:border-black print:text-black">
                                        <span>Total</span>
                                        <span className="text-primary print:text-black">{formatRupiah(showReceipt.total)}</span>
                                    </div>
                                    {showReceipt.amountPaid && (
                                        <>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-muted-foreground print:text-black font-medium">Dibayar</span>
                                                <span className="font-bold text-foreground print:text-black">{formatRupiah(showReceipt.amountPaid)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-600 print:text-black font-bold">Kembalian</span>
                                                <span className="text-emerald-600 print:text-black font-black">{formatRupiah(showReceipt.changeAmount)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-5 pt-4 border-t border-dashed border-border print:border-black text-xs text-muted-foreground print:text-black font-medium">
                                    <p>Payment: {showReceipt.paymentMethod.toUpperCase()}</p>
                                    <p className="mt-0.5">{showReceipt.date.toLocaleString("id-ID")}</p>
                                    <p className="mt-3 font-bold text-card-foreground print:text-black">
                                        {receiptFooter || `Thank you for visiting ${storeName || 'Kaelcafe'} ☕`}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border gap-3 flex flex-col bg-muted/20 print:hidden">
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={handlePrint} className="flex-1 h-12 rounded-xl font-bold bg-background">
                                        <Printer className="size-4 mr-2" />
                                        Print
                                    </Button>
                                    <Button onClick={() => setShowReceipt(null)} className="flex-1 h-12 rounded-xl font-bold">
                                        New Order
                                    </Button>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        if (confirm("Yakin ingin membatalkan pesanan ini?")) {
                                            const res = await cancelOrder(showReceipt.orderId);
                                            if (res.success) {
                                                alert("Pesanan berhasil dibatalkan");
                                                setShowReceipt(null);
                                            } else {
                                                alert("Gagal: " + res.error);
                                            }
                                        }
                                    }}
                                    className="w-full h-11 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive font-bold rounded-xl"
                                >
                                    <XCircle className="size-4 mr-2" />
                                    Batalkan Pesanan
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
