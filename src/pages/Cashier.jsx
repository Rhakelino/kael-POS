import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { useAuth } from "@/components/AuthProvider";
import { Search, SearchX, Coffee, Plus, Minus, Trash2, ShoppingCart, CheckCircle2, Printer, Wallet, Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

function formatRupiah(num) { return "Rp " + Number(num).toLocaleString("id-ID"); }

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
                    <Button variant="ghost" size="sm" onClick={resetCart} className="text-destructive hover:text-destructive text-xs h-7 px-2 mr-8 lg:mr-0">Hapus Semua</Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-muted/10 min-h-0">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                        <ShoppingCart className="size-10 opacity-20 mb-3" />
                        <p className="text-sm font-medium">Belum ada pesanan</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold truncate">{item.name}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{formatRupiah(item.price * item.quantity)}</p>
                            </div>
                            <div className="flex items-center gap-0.5 bg-background border border-border rounded-full p-0.5">
                                <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={() => updateQuantity(item.id, -1)}>
                                    <Minus className="size-3" />
                                </Button>
                                <span className="text-xs font-bold w-6 text-center tabular-nums">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="size-7 rounded-full text-primary" onClick={() => updateQuantity(item.id, 1)}>
                                    <Plus className="size-3" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="size-7 rounded-full text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeFromCart(item.id)}>
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
                            <Button key={method.id} variant="ghost" size="sm" onClick={() => setPaymentMethod(method.id)} className={`flex-1 text-xs font-bold rounded-lg h-8 transition-all ${paymentMethod === method.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{method.name}</Button>
                        ))}
                    </div>
                )}
                {isCash && cart.length > 0 && (
                    <div className="space-y-2.5 bg-muted/30 p-3.5 rounded-xl border border-border/50">
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">Rp</span>
                            <Input type="number" placeholder="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="pl-11 h-11 text-lg font-black bg-background rounded-xl border-border" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {getQuickAmounts().map((amount, i) => (
                                <Button key={amount} variant="outline" size="sm" onClick={() => setAmountPaid(String(amount))} className={`h-7 px-3 text-[11px] font-bold rounded-full ${parsedAmountPaid === amount ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground"}`}>{i === 0 ? "Pas" : formatRupiah(amount)}</Button>
                            ))}
                        </div>
                        {parsedAmountPaid > 0 && (
                            <div className={`flex justify-between items-center p-3 rounded-xl ${changeAmount >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-destructive/10 border-destructive/20"}`}>
                                <span className={`text-xs font-bold uppercase ${changeAmount >= 0 ? "text-emerald-600" : "text-destructive"}`}>{changeAmount >= 0 ? "Kembalian" : "Kurang"}</span>
                                <span className={`text-xl font-black ${changeAmount >= 0 ? "text-emerald-600" : "text-destructive"}`}>{formatRupiah(Math.abs(changeAmount))}</span>
                            </div>
                        )}
                    </div>
                )}
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline px-1">
                        <span className="text-sm text-muted-foreground font-medium">Total</span>
                        <span className="text-2xl font-black text-foreground">{formatRupiah(total)}</span>
                    </div>
                    <Button onClick={handlePayNow} disabled={cart.length === 0 || isSubmitting || !cashValid} className="w-full h-12 rounded-xl font-black text-sm shadow-lg">{isSubmitting ? "..." : "Bayar Sekarang"}</Button>
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

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [catRes, prodRes] = await Promise.all([
                fetch("/api/categories"),
                fetch(selectedCategory ? `/api/products?categoryId=${selectedCategory}` : "/api/products")
            ]);
            const cat = await catRes.json();
            const prod = await prodRes.json();
            if (cat.success) setCategories(cat.data);
            if (prod.success) setProductsList(prod.data);
        } catch(e) { }
        setIsLoading(false);
    }, [selectedCategory]);

    useEffect(() => { loadData(); }, [loadData]);

    const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const addToCart = (product) => {
        if (!product.isActive) return;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0));
    const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
    const resetCart = () => { setCart([]); setAmountPaid(""); };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const parsedAmountPaid = Number(amountPaid) || 0;
    const changeAmount = parsedAmountPaid - total;
    const isCash = paymentMethod === "cash";
    const cashValid = !isCash || (parsedAmountPaid >= total && parsedAmountPaid > 0);

    const getQuickAmounts = () => {
        if (total <= 0) return [];
        const amounts = [total];
        for (const d of [10000, 20000, 50000, 100000, 150000, 200000, 500000]) {
            const rounded = Math.ceil(total / d) * d;
            if (rounded > total && !amounts.includes(rounded)) amounts.push(rounded);
        }
        return amounts.slice(0, 5);
    };

    const handlePayNow = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        try {
            const payload = { 
                items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
                paymentMethod, 
                cashierId: user?.id || null,
                amountPaid: isCash ? parsedAmountPaid : null 
            };
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                setShowReceipt({ orderNumber: result.orderNumber, items: cart, total: result.total, paymentMethod, amountPaid: result.amountPaid, changeAmount: result.changeAmount, date: new Date() });
                resetCart();
                setCartOpen(false);
            } else {
                alert("Gagal dari server: " + result.error);
            }
        } catch(e) {
            alert("Gagal koneksi ke server: " + e.message);
        }
        setIsSubmitting(false);
    };

    const cartProps = { cart, total, updateQuantity, removeFromCart, resetCart, paymentMethod, setPaymentMethod, activePaymentMethods, amountPaid, setAmountPaid, parsedAmountPaid, changeAmount, isCash, cashValid, isSubmitting, handlePayNow, getQuickAmounts };

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <div className="px-4 pt-4 pb-2 space-y-3 bg-background">
                    <h1 className="text-lg font-black">{storeName}</h1>
                    <div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="w-full pl-10 h-10 bg-muted/50 border-0 rounded-xl" placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                </div>
                <div className="px-4 py-2"><ScrollArea className="w-full"><div className="flex items-center gap-1.5 pb-1"><button onClick={() => setSelectedCategory(null)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"}`}>Semua</button>{categories.map(cat => <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"}`}>{cat.icon} {cat.name}</button>)}</div></ScrollArea></div>
                <div className="flex-1 overflow-y-auto px-4 pb-20">
                    {isLoading ? <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div> : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                            {filteredProducts.map(product => {
                                const inCart = cart.find(i => i.id === product.id);
                                return (
                                    <button key={product.id} onClick={() => addToCart(product)} disabled={!product.isActive} className={`text-left bg-card p-2.5 rounded-2xl border ${!product.isActive ? "opacity-40 grayscale" : inCart ? "border-primary ring-1 ring-primary/20" : "border-border/60 hover:shadow-sm"}`}>
                                        <div className="aspect-[4/3] rounded-xl mb-2 bg-center bg-cover bg-muted relative" style={{ backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined }}>
                                            {inCart && <div className="absolute top-1.5 right-1.5 size-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-black">{inCart.quantity}</div>}
                                        </div>
                                        <h3 className="font-bold text-[13px] line-clamp-1">{product.name}</h3>
                                        <p className="font-bold text-xs text-primary mt-0.5">{formatRupiah(product.price)}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="hidden lg:block w-[360px] border-l border-border bg-card shrink-0 h-full"><CartPanel {...cartProps} /></div>
            {cart.length > 0 && (
                <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                    <SheetTrigger className="lg:hidden fixed bottom-20 right-4 z-40 h-14 pl-5 pr-4 rounded-2xl bg-primary text-white flex items-center gap-3 shadow-xl cursor-pointer border-0">
                        <div className="flex flex-col items-start"><span className="text-[10px]">{cartCount} item</span><span className="text-sm font-black">{formatRupiah(total)}</span></div><ShoppingCart className="size-4" />
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90dvh] p-0 rounded-t-3xl flex flex-col overflow-hidden [&>button]:top-3 [&>button]:right-3"><CartPanel {...cartProps} /></SheetContent>
                </Sheet>
            )}
            <Dialog open={!!showReceipt} onOpenChange={(o) => { if (!o) setShowReceipt(null); }}>
                <DialogContent className="sm:max-w-sm p-6 text-center">
                    <div id="receipt-print-area" className="p-4 bg-white text-black font-mono text-xs rounded-lg text-left space-y-3">
                        <div className="text-center border-b pb-3">
                            <h2 className="font-bold text-base uppercase">{storeName}</h2>
                            <p className="text-[10px] text-gray-500">Struk Pembayaran</p>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600">
                            <span>No: #{showReceipt?.orderNumber}</span>
                            <span>{showReceipt?.date ? new Date(showReceipt.date).toLocaleString("id-ID") : ""}</span>
                        </div>
                        <div className="border-b border-t py-2 space-y-1">
                            {showReceipt?.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>{formatRupiah(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{formatRupiah(showReceipt?.total || 0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="capitalize">Bayar ({showReceipt?.paymentMethod})</span>
                                <span>{formatRupiah(showReceipt?.amountPaid || showReceipt?.total || 0)}</span>
                            </div>
                            {showReceipt?.paymentMethod === "cash" && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Kembali</span>
                                    <span>{formatRupiah(showReceipt?.changeAmount || 0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center border-t pt-3 text-[10px] text-gray-500">
                            <p>{receiptFooter || "Terima Kasih atas Kunjungan Anda!"}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button onClick={() => window.print()} className="flex-1 font-bold flex gap-2 items-center justify-center">
                            <Printer className="size-4" /> Cetak Struk
                        </Button>
                        <Button variant="outline" onClick={() => setShowReceipt(null)} className="flex-1">Tutup</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
