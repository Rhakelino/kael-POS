import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/components/SettingsProvider";
import { useAuth } from "@/components/AuthProvider";
import { Store, UtensilsCrossed, ChartBar, Moon, Sun, Save, LogOut, Printer, User, Pencil, Trash2, Plus, Coffee, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

function formatRupiah(num) { return "Rp " + Number(num).toLocaleString("id-ID"); }

export default function Settings() {
    const { user, setUser } = useAuth();
    const { storeName, theme, autoPrint, saveSettings } = useSettings();
    const [tab, setTab] = useState("store");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const navigate = useNavigate();
    
    const loadMenu = useCallback(async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) setProducts(data.data);
    }, []);

    const loadCategories = useCallback(async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data);
    }, []);

    useEffect(() => { 
        loadMenu(); 
        loadCategories();
    }, [loadMenu, loadCategories]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        navigate("/login", { replace: true });
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Hapus produk ini?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("Produk dihapus");
                loadMenu();
            } else {
                toast.error(data.error || "Gagal hapus");
            }
        } catch (e) {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const isNew = !editProduct.id;
            const url = isNew ? "/api/products" : `/api/products/${editProduct.id}`;
            const method = isNew ? "POST" : "PUT";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editProduct.name,
                    price: Number(editProduct.price),
                    categoryId: editProduct.categoryId,
                    imageUrl: editProduct.imageUrl
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(isNew ? "Produk berhasil ditambahkan" : "Produk berhasil diperbarui");
                setEditProduct(null);
                loadMenu();
            } else {
                toast.error(data.error || "Gagal menyimpan");
            }
        } catch (e) {
            toast.error("Terjadi kesalahan jaringan");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setEditProduct({ ...editProduct, imageUrl: reader.result });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col min-h-full">
            <div className="px-4 pt-4 pb-2 bg-background sticky top-0 z-10 space-y-3">
                <h1 className="text-lg font-black">Pengaturan</h1>
                <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
                    {[{id:"store", l:"Toko", i:Store}, {id:"menu", l:"Menu", i:UtensilsCrossed}, {id:"report", l:"Laporan", i:ChartBar}].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold ${tab === t.id ? "bg-background shadow-sm" : "text-muted-foreground"}`}><t.i className="size-3.5"/>{t.l}</button>
                    ))}
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {tab === "store" && (
                    <>
                        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border">
                            <div className="flex items-center gap-3">
                                <User className="size-8 p-1.5 rounded-full bg-primary/10 text-primary" />
                                <div><p className="font-bold text-sm">{user?.name}</p><p className="text-xs text-muted-foreground uppercase">{user?.role}</p></div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive"><LogOut className="size-4" /></Button>
                        </div>
                        <div className="bg-card rounded-2xl border overflow-hidden divide-y">
                            <div className="p-4 flex justify-between items-center"><span className="font-bold text-sm flex gap-3"><Moon className="size-4 text-primary"/>Mode Gelap</span><Switch checked={theme === 'dark'} onCheckedChange={c => saveSettings({theme: c ? 'dark' : 'light'})} /></div>
                            <div className="p-4 flex justify-between items-center"><span className="font-bold text-sm flex gap-3"><Printer className="size-4 text-primary"/>Auto Print</span><Switch checked={autoPrint} onCheckedChange={c => saveSettings({autoPrint: c})} /></div>
                        </div>
                    </>
                )}
                {tab === "menu" && (
                    <div className="bg-card rounded-2xl border p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm">Produk ({products.length})</h3>
                            <Button size="sm" variant="outline" className="h-7" onClick={() => setEditProduct({name: '', price: '', categoryId: categories[0]?.id || '', imageUrl: ''})}>
                                <Plus className="size-3 mr-1"/>Tambah
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {products.map(p => (
                                <div key={p.id} className="flex items-center gap-3 p-2 border rounded-xl bg-muted/20 group">
                                    <div className="size-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                        {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <Coffee className="size-4 opacity-50"/>}
                                    </div>
                                    <div className="flex-1"><p className="font-bold text-sm">{p.name}</p><p className="text-xs text-primary">{formatRupiah(p.price)}</p></div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="size-7 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditProduct(p)}>
                                            <Pencil className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-7 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab === "report" && (
                    <div className="p-10 text-center text-muted-foreground text-sm font-medium">Laporan akan segera hadir</div>
                )}
            </div>

            <Dialog open={!!editProduct} onOpenChange={(o) => !o && setEditProduct(null)}>
                <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[425px] rounded-2xl mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editProduct?.id ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
                    </DialogHeader>
                    {editProduct && (
                        <form onSubmit={handleSaveProduct} className="space-y-4 pt-4">
                            <div className="flex flex-col items-center gap-2 mb-4">
                                <div className="size-24 bg-muted rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center relative group">
                                    {editProduct.imageUrl ? (
                                        <img src={editProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Coffee className="size-8 opacity-20" />
                                    )}
                                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                                        <Pencil className="size-5" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                <span className="text-xs text-muted-foreground">Klik gambar untuk ubah</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Produk</label>
                                <Input value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kategori</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={editProduct.categoryId} 
                                    onChange={e => setEditProduct({...editProduct, categoryId: e.target.value})} 
                                    required
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Harga (Rp)</label>
                                <Input type="number" value={editProduct.price} onChange={e => setEditProduct({...editProduct, price: e.target.value})} required min="0" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditProduct(null)}>Batal</Button>
                                <Button type="submit" disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan'}</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
