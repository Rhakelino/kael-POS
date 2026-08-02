"use client";

import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { useAuth } from "@/components/AuthProvider";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import {
    getAllProducts, getCategories, createProduct, updateProduct,
    deleteProduct, toggleProduct, createCategory, updateCategory, deleteCategory,
} from "@/actions/products";

import { getDashboardStats, getTopItems } from "@/actions/analytics";

import {
    Moon, Sun, Printer, CheckCircle2, Circle, Save,
    Plus, Pencil, Trash2, Coffee, LogOut, User,
    Store, UtensilsCrossed, ChartBar,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

function ProductForm({ product, categories, onSave, onClose }) {
    const [name, setName] = useState(product?.name || "");
    const [price, setPrice] = useState(product?.price || "");
    const [categoryId, setCategoryId] = useState(product?.categoryId || "");
    const [sku, setSku] = useState(product?.sku || "");
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price || !categoryId) return;
        setIsSubmitting(true);
        const data = { name, price: parseFloat(price), categoryId, sku: sku || null, imageUrl: imageUrl || null };
        const result = product ? await updateProduct(product.id, data) : await createProduct(data);
        setIsSubmitting(false);
        if (result.success) { toast.success(product ? "Produk diupdate" : "Produk ditambahkan"); onSave(); }
        else toast.error(result.error);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) setImageUrl(data.url);
        } catch { toast.error("Upload gagal"); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label>Nama Produk</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Americano" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label>Harga</Label>
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="25000" required />
                </div>
                <div className="space-y-1.5">
                    <Label>SKU</Label>
                    <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="COF-001" />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1.5">
                <Label>Gambar</Label>
                <div className="flex items-center gap-3">
                    {imageUrl && <div className="size-14 rounded-xl bg-muted bg-center bg-cover border" style={{ backgroundImage: `url('${imageUrl}')` }} />}
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                </div>
            </div>
            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Batal</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl">
                    {isSubmitting ? "Menyimpan..." : product ? "Update" : "Tambah"}
                </Button>
            </div>
        </form>
    );
}

function CategoryForm({ category, onSave, onClose }) {
    const [name, setName] = useState(category?.name || "");
    const [icon, setIcon] = useState(category?.icon || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return;
        setIsSubmitting(true);
        const data = { name, icon: icon || null };
        const result = category ? await updateCategory(category.id, data) : await createCategory(data);
        setIsSubmitting(false);
        if (result.success) { toast.success(category ? "Kategori diupdate" : "Kategori ditambahkan"); onSave(); }
        else toast.error(result.error);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label>Nama Kategori</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Coffee" required />
            </div>
            <div className="space-y-1.5">
                <Label>Icon (emoji)</Label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="☕" />
            </div>
            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Batal</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl">
                    {isSubmitting ? "Menyimpan..." : category ? "Update" : "Tambah"}
                </Button>
            </div>
        </form>
    );
}

export default function Settings() {
    const router = useRouter();
    const { user } = useAuth();
    const {
        storeName: ctxStoreName, contactNumber: ctxContactNumber, address: ctxAddress,
        autoPrint: ctxAutoPrint, receiptFooter: ctxReceiptFooter,
        paymentMethods: ctxPaymentMethods, theme: ctxTheme, saveSettings,
    } = useSettings();

    const [activeTab, setActiveTab] = useState("store");
    const [storeName, setStoreName] = useState(ctxStoreName);
    const [contactNumber, setContactNumber] = useState(ctxContactNumber);
    const [address, setAddress] = useState(ctxAddress);
    const [autoPrint, setAutoPrint] = useState(ctxAutoPrint);
    const [receiptFooter, setReceiptFooter] = useState(ctxReceiptFooter);
    const [paymentMethods, setPaymentMethods] = useState(ctxPaymentMethods);
    const [theme, setTheme] = useState(ctxTheme);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [stats, setStats] = useState(null);
    const [topItems, setTopItems] = useState([]);

    useEffect(() => {
        setStoreName(ctxStoreName); setContactNumber(ctxContactNumber); setAddress(ctxAddress);
        setAutoPrint(ctxAutoPrint); setReceiptFooter(ctxReceiptFooter);
        setPaymentMethods(ctxPaymentMethods); setTheme(ctxTheme);
    }, [ctxStoreName, ctxContactNumber, ctxAddress, ctxAutoPrint, ctxReceiptFooter, ctxPaymentMethods, ctxTheme]);

    const loadMenu = useCallback(async () => {
        const [prodResult, catResult] = await Promise.all([getAllProducts(), getCategories()]);
        if (prodResult.success) setProducts(prodResult.data);
        if (catResult.success) setCategories(catResult.data);
    }, []);

    const loadStats = useCallback(async () => {
        const [statsResult, topResult] = await Promise.all([getDashboardStats(), getTopItems(5)]);
        if (statsResult.success) setStats(statsResult.data);
        if (topResult.success) setTopItems(topResult.data);
    }, []);

    useEffect(() => { 
        loadMenu(); 
        loadStats();
    }, [loadMenu, loadStats]);

    const handleSave = () => {
        saveSettings({ storeName, contactNumber, address, autoPrint, receiptFooter, paymentMethods, theme });
        toast.success("Pengaturan tersimpan");
    };

    const togglePaymentMethod = (id) => {
        setPaymentMethods(paymentMethods.map(pm => pm.id === id ? { ...pm, active: !pm.active } : pm));
    };

    const handleToggleProduct = async (id) => { const r = await toggleProduct(id); if (r.success) loadMenu(); };
    const handleDeleteProduct = async (id) => { if (!confirm("Hapus produk ini?")) return; const r = await deleteProduct(id); if (r.success) { toast.success("Produk dihapus"); loadMenu(); } };
    const handleDeleteCategory = async (id) => { if (!confirm("Hapus kategori ini? Produk di dalamnya juga terhapus.")) return; const r = await deleteCategory(id); if (r.success) { toast.success("Kategori dihapus"); loadMenu(); } };

    const handleLogout = async () => { await logout(); router.push("/login"); router.refresh(); };

    const tabs = [
        { id: "store", label: "Toko", icon: Store },
        { id: "menu", label: "Menu", icon: UtensilsCrossed },
        { id: "report", label: "Laporan", icon: ChartBar },
    ];

    return (
        <div className="flex flex-col min-h-full">
            {/* Header */}
            <div className="px-4 lg:px-6 pt-4 pb-2 bg-background sticky top-0 z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-black text-foreground">Pengaturan</h1>
                    <Button size="sm" onClick={handleSave} className="rounded-xl font-bold h-8 px-4">
                        <Save className="size-3 mr-1.5" />
                        Simpan
                    </Button>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <Icon className="size-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 px-4 lg:px-6 py-4 space-y-4">
                {activeTab === "store" && (
                    <>
                        {/* User Card */}
                        <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border/60">
                            <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{user?.name || "User"}</p>
                                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{user?.role || "cashier"}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive text-xs font-bold shrink-0 rounded-xl">
                                <LogOut className="size-3.5 mr-1" />
                                Keluar
                            </Button>
                        </div>

                        {/* Store Info */}
                        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-4">
                            <h3 className="text-sm font-bold text-foreground">Profil Toko</h3>
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Nama Toko</Label>
                                    <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="bg-muted/40 border-0 rounded-xl h-10" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">No. Telepon</Label>
                                        <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-muted/40 border-0 rounded-xl h-10" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Alamat</Label>
                                        <Input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-muted/40 border-0 rounded-xl h-10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Settings */}
                        <div className="bg-card rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/50">
                            <button
                                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                                onClick={() => {
                                    const t = theme === "dark" ? "light" : "dark";
                                    setTheme(t);
                                    saveSettings({ storeName, contactNumber, address, autoPrint, receiptFooter, paymentMethods, theme: t });
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                        {theme === "dark" ? <Moon className="size-4 text-primary" /> : <Sun className="size-4 text-primary" />}
                                    </div>
                                    <span className="text-sm font-bold">Mode Gelap</span>
                                </div>
                                <Switch checked={theme === "dark"} />
                            </button>
                            <button
                                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                                onClick={() => setAutoPrint(!autoPrint)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                        <Printer className="size-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-bold">Auto Print Struk</span>
                                </div>
                                <Switch checked={autoPrint} />
                            </button>
                        </div>

                        {/* Receipt Footer */}
                        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-2">
                            <Label className="text-xs text-muted-foreground">Footer Struk</Label>
                            <Textarea
                                value={receiptFooter}
                                onChange={(e) => setReceiptFooter(e.target.value)}
                                className="bg-muted/40 border-0 rounded-xl resize-none text-sm h-20"
                                placeholder="Terima kasih sudah berkunjung!"
                            />
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-3">
                            <h3 className="text-sm font-bold text-foreground">Metode Pembayaran</h3>
                            <div className="space-y-1.5">
                                {paymentMethods.map(pm => (
                                    <button
                                        key={pm.id}
                                        onClick={() => togglePaymentMethod(pm.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${pm.active
                                            ? "border-primary/30 bg-primary/5"
                                            : "border-border/50 hover:bg-muted/30"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-base">{pm.icon}</span>
                                            <span className={`text-sm font-bold ${pm.active ? "text-foreground" : "text-muted-foreground"}`}>{pm.name}</span>
                                        </div>
                                        {pm.active ? <CheckCircle2 className="size-4 text-primary" /> : <Circle className="size-4 text-muted-foreground/40" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "menu" && (
                    <>
                        {/* Categories */}
                        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-foreground">Kategori</h3>
                                <Button size="sm" variant="outline" onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }} className="h-7 text-xs rounded-lg">
                                    <Plus className="size-3 mr-1" />
                                    Tambah
                                </Button>
                            </div>
                            {categories.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">Belum ada kategori</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-base">{cat.icon || "📦"}</span>
                                                <span className="text-sm font-bold">{cat.name}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <Button variant="ghost" size="icon" className="size-7 rounded-lg" onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }}>
                                                    <Pencil className="size-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-7 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(cat.id)}>
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Products */}
                        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-foreground">Produk ({products.length})</h3>
                                <Button size="sm" variant="outline" onClick={() => { setEditingProduct(null); setShowProductForm(true); }} className="h-7 text-xs rounded-lg">
                                    <Plus className="size-3 mr-1" />
                                    Tambah
                                </Button>
                            </div>
                            {products.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">Belum ada produk</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {products.map((product) => (
                                        <div key={product.id} className={`flex items-center gap-3 p-3 rounded-xl border border-border/40 transition-all ${!product.isActive ? "opacity-40 bg-muted/10" : "bg-muted/30"}`}>
                                            <div
                                                className="size-10 rounded-xl bg-muted bg-center bg-cover shrink-0 flex items-center justify-center border border-border/30"
                                                style={{ backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined }}
                                            >
                                                {!product.imageUrl && <Coffee className="size-4 text-muted-foreground/30" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{product.name}</p>
                                                <p className="text-[11px] text-muted-foreground">{formatRupiah(product.price)}</p>
                                            </div>
                                            <Badge
                                                variant={product.isActive ? "default" : "secondary"}
                                                className="text-[9px] shrink-0 cursor-pointer rounded-full px-2"
                                                onClick={() => handleToggleProduct(product.id)}
                                            >
                                                {product.isActive ? "Aktif" : "Off"}
                                            </Badge>
                                            <div className="flex items-center gap-0.5 shrink-0">
                                                <Button variant="ghost" size="icon" className="size-7 rounded-lg" onClick={() => { setEditingProduct(product); setShowProductForm(true); }}>
                                                    <Pencil className="size-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-7 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "report" && (
                    <>
                        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-4">
                            <h3 className="text-sm font-bold text-foreground">Penjualan Hari Ini</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
                                    <span className="text-xs text-muted-foreground font-medium">Total Pendapatan</span>
                                    <p className="text-lg font-black text-foreground mt-0.5">{formatRupiah(stats?.totalRevenue || 0)}</p>
                                </div>
                                <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
                                    <span className="text-xs text-muted-foreground font-medium">Order Selesai</span>
                                    <p className="text-lg font-black text-foreground mt-0.5">{stats?.orderCount || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-3">
                            <h3 className="text-sm font-bold text-foreground">Top 5 Menu (7 Hari Terakhir)</h3>
                            {topItems.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-6">Belum ada data penjualan</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {topItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/30">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                                    #{idx + 1}
                                                </div>
                                                <span className="text-sm font-bold">{item.productName}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-muted-foreground">{item.totalQuantity} terjual</span>
                                                <span className="text-sm font-bold tabular-nums text-right">{formatRupiah(item.totalRevenue)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="h-4" />
            </div>

            <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader><DialogTitle>{editingProduct ? "Edit Produk" : "Tambah Produk"}</DialogTitle></DialogHeader>
                    <ProductForm product={editingProduct} categories={categories} onSave={() => { setShowProductForm(false); loadMenu(); }} onClose={() => setShowProductForm(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
                <DialogContent className="sm:max-w-sm rounded-2xl">
                    <DialogHeader><DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle></DialogHeader>
                    <CategoryForm category={editingCategory} onSave={() => { setShowCategoryForm(false); loadMenu(); }} onClose={() => setShowCategoryForm(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
