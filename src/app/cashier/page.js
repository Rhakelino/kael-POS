"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories, getProducts } from "@/actions/products";
import { createOrder, cancelOrder } from "@/actions/orders";
import { useSettings } from "@/components/SettingsProvider";

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

    const { storeName, autoPrint, receiptFooter, taxRates, paymentMethods } = useSettings();
    const standardTaxRate = taxRates?.[0]?.rate || 10;
    const activePaymentMethods = paymentMethods?.filter(pm => pm.active) || [];

    // Auto-select first available payment method if none selected or if current is invalid
    useEffect(() => {
        if (activePaymentMethods.length > 0 && !activePaymentMethods.find(p => p.id === paymentMethod)) {
            setPaymentMethod(activePaymentMethods[0].id);
        }
    }, [activePaymentMethods, paymentMethod]);

    // Auto print receipt
    useEffect(() => {
        if (showReceipt && autoPrint) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [showReceipt, autoPrint]);

    // Load categories and products
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

    // Filter products by search
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Cart functions
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
    };

    // Calculate totals
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = taxEnabled ? Math.round(subtotal * (standardTaxRate / 100)) : 0;
    const discount =
        discountCode.toUpperCase() === "KING EMYU"
            ? Math.round(subtotal * 0.5)
            : 0;
    const total = subtotal + tax - discount;

    // Submit order
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
            });

            if (result.success) {
                setShowReceipt({
                    orderNumber: result.orderNumber,
                    items: [...cart],
                    subtotal,
                    tax,
                    discount,
                    total: result.total,
                    paymentMethod,
                    date: new Date(),
                });
                setCart([]);
                setDiscountCode("");
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            alert("Failed to create order: " + error.message);
        }
        setIsSubmitting(false);
    };

    // Print receipt
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 flex flex-col h-full min-w-0">
            {/* Header */}
            <header className="h-16 border-b border-primary/10 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 pl-14 lg:px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                            Shift Open
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-medium">
                        <span className="material-symbols-outlined text-lg">
                            schedule
                        </span>
                        <span className="text-sm">
                            <LiveClock />
                        </span>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:bg-zinc-800 transition-colors">
                        <span className="material-symbols-outlined">
                            notifications
                        </span>
                    </button>
                </div>
            </header>

            {/* POS Body */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden lg:overflow-hidden relative">
                {/* Left: Product Menu */}
                <div className="w-full lg:w-[65%] flex-1 flex flex-col bg-slate-50 dark:bg-zinc-900/50 lg:border-r border-primary/10 dark:border-zinc-800 overflow-hidden">
                    {/* Search & Tabs */}
                    <div className="p-6 pb-0 space-y-6">
                        <div className="relative max-w-xl">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400">
                                search
                            </span>
                            <input
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                placeholder="Search menu items..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-6 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === null
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-primary"
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() =>
                                        setSelectedCategory(cat.id)
                                    }
                                    className={`px-6 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                        ? "border-primary text-primary font-bold"
                                        : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-primary"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-zinc-400">
                                <span className="material-symbols-outlined text-4xl mb-2">
                                    search_off
                                </span>
                                <p className="text-sm font-medium">
                                    No products found
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map((product) => {
                                    const inCart = cart.find(
                                        (item) =>
                                            item.productId === product.id
                                    );
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            className={`bg-white dark:bg-zinc-950 p-3 rounded-xl border transition-all shadow-sm relative ${!product.isActive
                                                ? "border-slate-200 dark:border-zinc-800 opacity-60 grayscale cursor-not-allowed"
                                                : inCart
                                                    ? "border-primary ring-2 ring-primary/20 cursor-pointer"
                                                    : "border-slate-200 dark:border-zinc-800 hover:border-primary/50 cursor-pointer group"
                                                }`}
                                        >
                                            <div
                                                className="aspect-square rounded-lg mb-3 bg-center bg-cover bg-slate-100 dark:bg-zinc-800 overflow-hidden relative"
                                                style={{
                                                    backgroundImage: product.imageUrl
                                                        ? `url('${product.imageUrl}')`
                                                        : undefined,
                                                }}
                                            >
                                                {product.isActive ? (
                                                    <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded uppercase">
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="absolute top-2 right-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded uppercase">
                                                        Sold Out
                                                    </span>
                                                )}
                                                {!product.imageUrl && (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-4xl text-slate-300">
                                                            coffee
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-slate-800 dark:text-zinc-100">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p
                                                    className={`font-bold text-sm ${product.isActive
                                                        ? "text-primary"
                                                        : "text-slate-500 dark:text-zinc-400"
                                                        }`}
                                                >
                                                    {formatRupiah(
                                                        product.price
                                                    )}
                                                </p>
                                                {inCart && (
                                                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                        ×{inCart.quantity}
                                                    </span>
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
                <div className="w-full lg:w-[35%] h-[45vh] min-h-[350px] lg:h-full lg:min-h-0 flex flex-col bg-white dark:bg-zinc-950 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-zinc-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:shadow-none z-10 overflow-hidden shrink-0">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800">
                        <h2 className="text-sm font-bold">Current Order</h2>
                        <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-zinc-400 font-mono">
                            {cart.length} items
                        </span>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                <span className="material-symbols-outlined text-4xl mb-2">
                                    shopping_cart
                                </span>
                                <p className="text-xs font-medium">
                                    Cart is empty
                                </p>
                                <p className="text-[10px] mt-0.5">
                                    Click a product to add it
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="px-3 py-2 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800"
                                >
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="min-w-0 flex-1 mr-2">
                                            <h4 className="text-xs font-bold truncate">
                                                {item.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 dark:text-zinc-400">
                                                {formatRupiah(item.price)} each
                                            </p>
                                        </div>
                                        <span className="text-xs font-bold whitespace-nowrap">
                                            {formatRupiah(
                                                item.price * item.quantity
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        -1
                                                    )
                                                }
                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:bg-zinc-900"
                                            >
                                                <span className="material-symbols-outlined text-xs">
                                                    remove
                                                </span>
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        1
                                                    )
                                                }
                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:bg-zinc-900"
                                            >
                                                <span className="material-symbols-outlined text-xs">
                                                    add
                                                </span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.productId)
                                            }
                                            className="text-rose-400 hover:text-rose-600 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Checkout Section */}
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-zinc-800 space-y-2.5 bg-slate-50 dark:bg-zinc-900/50">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-zinc-400">Subtotal</span>
                                <span className="font-bold">
                                    {formatRupiah(subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 dark:text-zinc-400">
                                    Tax ({standardTaxRate}%)
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        className="sr-only peer"
                                        type="checkbox"
                                        checked={taxEnabled}
                                        onChange={(e) =>
                                            setTaxEnabled(e.target.checked)
                                        }
                                    />
                                    <div className="w-8 h-4 bg-slate-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-zinc-950 after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            {taxEnabled && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 dark:text-zinc-400">
                                        Tax amount
                                    </span>
                                    <span className="text-slate-500 dark:text-zinc-400">
                                        +{formatRupiah(tax)}
                                    </span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-emerald-500">
                                        Discount
                                    </span>
                                    <span className="text-emerald-600 font-bold">
                                        -{formatRupiah(discount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center gap-3 text-xs">
                                <span className="text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                                    Discount code
                                </span>
                                <input
                                    className="flex-1 px-2 py-0.5 text-right bg-transparent border-b border-slate-300 dark:border-zinc-800 focus:border-primary outline-none transition-colors text-primary font-bold text-xs"
                                    placeholder="CODE10"
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) =>
                                        setDiscountCode(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex gap-1.5 flex-wrap">
                            {activePaymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`flex-1 min-w-[30%] py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${paymentMethod === method.id
                                        ? "bg-primary text-white"
                                        : "bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:bg-zinc-900"
                                        }`}
                                >
                                    {method.name}
                                </button>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-end">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                Total Amount
                            </span>
                            <span className="text-lg font-black text-primary">
                                {formatRupiah(total)}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                onClick={resetCart}
                                className="py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold hover:bg-white dark:bg-zinc-950 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                disabled={cart.length === 0}
                                className="py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold hover:bg-white dark:bg-zinc-950 transition-colors disabled:opacity-50"
                            >
                                Pending
                            </button>
                        </div>
                        <button
                            onClick={handlePayNow}
                            disabled={cart.length === 0 || isSubmitting}
                            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">
                                        payments
                                    </span>
                                    Pay Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>

            {/* Receipt Modal */}
            {showReceipt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                        {/* Receipt Content */}
                        <div className="p-8 text-center" id="receipt-content">
                            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-emerald-600">
                                    check_circle
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                Payment Successful!
                            </h3>
                            <p className="text-slate-400 dark:text-zinc-400 text-sm font-mono mb-6">
                                {showReceipt.orderNumber}
                            </p>

                            <div className="border-t border-dashed border-slate-200 dark:border-zinc-800 pt-4 space-y-2 text-left">
                                {showReceipt.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-slate-600 dark:text-zinc-400">
                                            {item.quantity}× {item.name}
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-zinc-100">
                                            {formatRupiah(
                                                item.price * item.quantity
                                            )}
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
                                        {formatRupiah(showReceipt.subtotal)}
                                    </span>
                                </div>
                                {showReceipt.tax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Tax
                                        </span>
                                        <span>
                                            +{formatRupiah(showReceipt.tax)}
                                        </span>
                                    </div>
                                )}
                                {showReceipt.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-500">
                                            Discount
                                        </span>
                                        <span className="text-emerald-600">
                                            -
                                            {formatRupiah(
                                                showReceipt.discount
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-black pt-2 border-t border-slate-100 dark:border-zinc-800">
                                    <span>Total</span>
                                    <span className="text-primary">
                                        {formatRupiah(showReceipt.total)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-400">
                                <p>
                                    Payment:{" "}
                                    {showReceipt.paymentMethod.toUpperCase()}
                                </p>
                                <p>
                                    {showReceipt.date.toLocaleString("id-ID")}
                                </p>
                                <p className="mt-2 font-bold text-slate-500 dark:text-zinc-400">
                                    {receiptFooter || `Thank you for visiting ${storeName} ☕`}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-zinc-800 rounded-xl font-bold text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        print
                                    </span>
                                    Print
                                </button>
                                <button
                                    onClick={() => setShowReceipt(null)}
                                    className="flex-1 py-3 bg-primary rounded-xl font-bold text-sm text-white hover:bg-primary/90 transition-colors"
                                >
                                    New Order
                                </button>
                            </div>
                            <button
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
                                className="w-full py-2.5 border border-rose-200 text-rose-500 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">cancel</span>
                                Batalkan Pesanan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
