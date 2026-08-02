"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories, getProducts } from "@/actions/products";
import { createOrder } from "@/actions/orders";
import { useSettings } from "@/components/SettingsProvider";
import { useAuth } from "@/components/AuthProvider";

import {
    Search,
    SearchX,
    Coffee,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    CheckCircle2,
    Printer,
    Wallet,
    Banknote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

function CartPanel({ cart, total, updateQuantity, removeFromCart, resetCart, paymentMethod, setPaymentMethod, activePaymentMethods, amountPaid, setAmountPaid, parsedAmountPaid, changeAmount, isCash, cashValid, isSubmitting, handlePayNow, getQuickAmounts }) {
    return (
        <div className="flex flex-col h-full bg-card">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border shrink-0 bg-card">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="size-4 text-primary" />
                    <h2 className="text-sm font-bold">Pesanan</h2>
                    <Badge variant="secondary" className="text-[10px] font-mono">{cart.length}</Badge>
                </div>
                {cart.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetCart} className="text-destructive hover:text-destructive text-xs h-7 px-2 mr-8 lg:mr-0">
                        Hapus Semua
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-muted/10 min-h-0">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                        <ShoppingCart className="size-10 opacity-20 mb-3" />
                        <p className="text-sm font-medium">Belum ada pesanan</p>
                        <p className="text-xs opacity-50 mt-1">Tap menu untuk menambahkan</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold truncate">{item.name}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{formatRupiah(item.price * item.quantity)}</p>
                            </div>
                            <div className="flex items-center gap-0.5 bg-background border border-border rounded-full p-0.5">
                                <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={() => updateQuantity(item.productId, -1)}>
                                    <Minus className="size-3" />
                                </Button>
                                <span className="text-xs font-bold w-6 text-center tabular-nums">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="size-7 rounded-full text-primary" onClick={() => updateQuantity(item.productId, 1)}>
                                    <Plus className="size-3" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="size-7 rounded-full text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeFromCart(item.productId)}>
                                <Trash2 className="size-3.5" />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t border-border p-4 space-y-3 bg-card/50 shrink-0">
                {activePaymentMethods.length > 1 && (
                    <div className="flex gap-1.5 bg-muted/50 p-1 rounded-xl">
                        {activePaymentMethods.map((method) => (
                            <Button
                                key={method.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex-1 text-xs font-bold rounded-lg h-8 transition-all ${paymentMethod === method.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {method.name}
                            </Button>
                        ))}
                    </div>
                )}

                {isCash && cart.length > 0 && (
                    <div className="space-y-2.5 bg-muted/30 p-3.5 rounded-xl border border-border/50">
                        <div className="flex items-center gap-2">
                            <Banknote className="size-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bayar Tunai</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">Rp</span>
                            <Input
                                type="number"
                                placeholder="0"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                className="pl-11 h-11 text-lg font-black bg-background rounded-xl border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {getQuickAmounts().map((amount, i) => (
                                <Button
                                    key={amount}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmountPaid(String(amount))}
                                    className={`h-7 px-3 text-[11px] font-bold rounded-full transition-all ${parsedAmountPaid === amount
                                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                                        : "bg-background text-muted-foreground"
                                        }`}
                                >
                                    {i === 0 ? "Pas" : formatRupiah(amount)}
                                </Button>
                            ))}
                        </div>
                        {parsedAmountPaid > 0 && (
                            <div className={`flex justify-between items-center p-3 rounded-xl ${changeAmount >= 0
                                ? "bg-emerald-500/10 border border-emerald-500/20"
                                : "bg-destructive/10 border border-destructive/20"
                                }`}>
                                <span className={`text-xs font-bold uppercase tracking-wide ${changeAmount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                                    {changeAmount >= 0 ? "Kembalian" : "Kurang"}
                                </span>
                                <span className={`text-xl font-black tabular-nums ${changeAmount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                                    {formatRupiah(Math.abs(changeAmount))}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex justify-between items-baseline px-1">
                        <span className="text-sm text-muted-foreground font-medium">Total</span>
                        <span className="text-2xl font-black text-foreground tabular-nums">{formatRupiah(total)}</span>
                    </div>
                    <Button
                        onClick={handlePayNow}
                        disabled={cart.length === 0 || isSubmitting || !cashValid}
                        className="w-full h-12 rounded-xl font-black text-sm shadow-lg disabled:opacity-40 active:scale-[0.98] transition-all"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Wallet className="size-4 mr-2" />
                                Bayar Sekarang
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function Cashier() {
    const [categories, setCategories] = useState([]);
    const [products, setProductsList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReceipt, setShowReceipt] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState("");
    const [cartOpen, setCartOpen] = useState(false);

    const { storeName, receiptFooter, paymentMethods } = useSettings();
    const { user } = useAuth();
    const activePaymentMethods = paymentMethods?.filter(pm => pm.active) || [];

    useEffect(() => {
        if (activePaymentMethods.length > 0 && !activePaymentMethods.find(p => p.id === paymentMethod)) {
            setPaymentMethod(activePaymentMethods[0].id);
        }
    }, [activePaymentMethods, paymentMethod]);

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
            return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) =>
            prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
    };

    const resetCart = () => {
        setCart([]);
        setAmountPaid("");
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const parsedAmountPaid = Number(amountPaid) || 0;
    const changeAmount = parsedAmountPaid - total;
    const isCash = paymentMethod === "cash";
    const cashValid = !isCash || (parsedAmountPaid >= total && parsedAmountPaid > 0);

    const getQuickAmounts = () => {
        if (total <= 0) return [];
        const amounts = [total];
        const denominations = [10000, 20000, 50000, 100000, 150000, 200000, 500000];
        for (const d of denominations) {
            const rounded = Math.ceil(total / d) * d;
            if (rounded > total && !amounts.includes(rounded)) amounts.push(rounded);
        }
        return amounts.slice(0, 5);
    };

    const handlePayNow = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        try {
            const result = await createOrder({
                items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
                paymentMethod,
                cashierId: user?.id || null,
                amountPaid: isCash ? parsedAmountPaid : null,
            });
            if (result.success) {
                setShowReceipt({
                    orderId: result.orderId,
                    orderNumber: result.orderNumber,
                    items: [...cart],
                    total: result.total,
                    paymentMethod,
                    amountPaid: result.amountPaid,
                    changeAmount: result.changeAmount,
                    date: new Date(),
                });
                setCart([]);
                setAmountPaid("");
                setCartOpen(false);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            alert("Gagal buat order: " + error.message);
        }
        setIsSubmitting(false);
    };

    const cartProps = { cart, total, updateQuantity, removeFromCart, resetCart, paymentMethod, setPaymentMethod, activePaymentMethods, amountPaid, setAmountPaid, parsedAmountPaid, changeAmount, isCash, cashValid, isSubmitting, handlePayNow, getQuickAmounts };

    return (
        <div className="flex h-full">
            {/* Product Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Header: Store name + Search */}
                <div className="px-4 pt-4 pb-2 space-y-3 bg-background">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-black text-foreground truncate">{storeName || "Kael Cafe"}</h1>
                        {user && (
                            <Badge variant="secondary" className="text-[10px] font-medium shrink-0">{user.name}</Badge>
                        )}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            className="w-full pl-10 pr-4 h-10 bg-muted/50 border-0 rounded-xl text-sm placeholder:text-muted-foreground/60"
                            placeholder="Cari menu..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="px-4 py-2">
                    <ScrollArea className="w-full">
                        <div className="flex items-center gap-1.5 pb-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === null
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat.id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    {cat.icon && <span className="mr-1">{cat.icon}</span>}
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto px-4 pb-20">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <SearchX className="size-10 mb-2 opacity-30" />
                            <p className="text-sm font-medium">Menu tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                            {filteredProducts.map((product) => {
                                const inCart = cart.find((item) => item.productId === product.id);
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        disabled={!product.isActive}
                                        className={`text-left bg-card p-2.5 rounded-2xl border transition-all relative select-none group ${!product.isActive
                                            ? "border-border opacity-40 grayscale cursor-not-allowed"
                                            : inCart
                                                ? "border-primary ring-1 ring-primary/20 shadow-sm"
                                                : "border-border/60 hover:border-border hover:shadow-sm active:scale-[0.97]"
                                            }`}
                                    >
                                        <div
                                            className="aspect-[4/3] rounded-xl mb-2 bg-center bg-cover bg-muted overflow-hidden relative"
                                            style={{ backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined }}
                                        >
                                            {!product.isActive && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">Habis</span>
                                                </div>
                                            )}
                                            {!product.imageUrl && product.isActive && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Coffee className="size-8 text-muted-foreground/30" />
                                                </div>
                                            )}
                                            {inCart && (
                                                <div className="absolute top-1.5 right-1.5 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-black">
                                                    {inCart.quantity}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-[13px] text-card-foreground line-clamp-1 leading-tight">{product.name}</h3>
                                        <p className="font-bold text-xs text-primary mt-0.5">{formatRupiah(product.price)}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Cart Panel — hidden on mobile */}
            <div className="hidden lg:block w-[360px] border-l border-border bg-card shrink-0 h-full">
                <CartPanel {...cartProps} />
            </div>

            {/* Mobile Cart FAB + Sheet */}
            {cart.length > 0 && (
                <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                    <SheetTrigger className="lg:hidden fixed bottom-20 right-4 z-40 h-14 pl-5 pr-4 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center gap-3 active:scale-95 transition-transform cursor-pointer outline-none border-0">
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-medium opacity-80">{cartCount} item</span>
                            <span className="text-sm font-black leading-none">{formatRupiah(total)}</span>
                        </div>
                        <div className="size-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                            <ShoppingCart className="size-4" />
                        </div>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90dvh] p-0 rounded-t-3xl [&>button]:top-3 [&>button]:right-3 flex flex-col overflow-hidden">
                        <SheetTitle className="sr-only">Keranjang</SheetTitle>
                        <CartPanel {...cartProps} />
                    </SheetContent>
                </Sheet>
            )}

            {/* Receipt Modal */}
            <Dialog open={!!showReceipt} onOpenChange={(open) => { if (!open) setShowReceipt(null); }}>
                <DialogContent className="sm:max-w-sm bg-card p-0 overflow-hidden border-border gap-0 rounded-2xl">
                    <DialogHeader className="p-0 border-b-0 space-y-0">
                        <DialogTitle className="sr-only">Pembayaran Berhasil</DialogTitle>
                    </DialogHeader>
                    {showReceipt && (
                        <>
                            <div className="p-6 pt-8 text-center">
                                <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="size-7 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-black text-foreground">Berhasil!</h3>
                                <p className="text-muted-foreground text-xs font-mono mt-1">#{showReceipt.orderNumber}</p>

                                <div className="mt-5 border-t border-dashed border-border pt-4 space-y-1.5 text-left">
                                    {showReceipt.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                                            <span className="font-bold tabular-nums">{formatRupiah(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-border mt-4 pt-3 text-left space-y-1">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-medium text-muted-foreground">Total</span>
                                        <span className="text-lg font-black text-foreground tabular-nums">{formatRupiah(showReceipt.total)}</span>
                                    </div>
                                    {showReceipt.amountPaid && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Dibayar</span>
                                                <span className="font-bold tabular-nums">{formatRupiah(showReceipt.amountPaid)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Kembalian</span>
                                                <span className="text-emerald-600 dark:text-emerald-400 font-black tabular-nums">{formatRupiah(showReceipt.changeAmount)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-dashed border-border text-[11px] text-muted-foreground">
                                    <p>{showReceipt.paymentMethod.toUpperCase()} &middot; {showReceipt.date.toLocaleString("id-ID")}</p>
                                    <p className="mt-2 font-semibold text-card-foreground text-xs">
                                        {receiptFooter || `Terima kasih sudah berkunjung di ${storeName || "Kael Cafe"}`}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border flex gap-2 bg-muted/30">
                                <Button variant="outline" onClick={() => window.print()} className="flex-1 h-11 rounded-xl font-bold">
                                    <Printer className="size-4 mr-2" />
                                    Print
                                </Button>
                                <Button onClick={() => setShowReceipt(null)} className="flex-1 h-11 rounded-xl font-bold">
                                    Order Baru
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
