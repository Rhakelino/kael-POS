import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { useAuth } from "@/components/AuthProvider";
import { Store, UtensilsCrossed, ChartBar, Moon, Sun, Save, LogOut, Printer, User, Pencil, Trash2, Plus, Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function formatRupiah(num) { return "Rp " + Number(num).toLocaleString("id-ID"); }

export default function Settings() {
    const { user, setUser } = useAuth();
    const { storeName, theme, autoPrint, saveSettings } = useSettings();
    const [tab, setTab] = useState("store");
    const [products, setProducts] = useState([]);
    
    const loadMenu = useCallback(async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) setProducts(data.data);
    }, []);

    useEffect(() => { loadMenu(); }, [loadMenu]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
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
                        <div className="flex justify-between items-center"><h3 className="font-bold text-sm">Produk ({products.length})</h3><Button size="sm" variant="outline" className="h-7"><Plus className="size-3 mr-1"/>Tambah</Button></div>
                        <div className="space-y-2">
                            {products.map(p => (
                                <div key={p.id} className="flex items-center gap-3 p-2 border rounded-xl bg-muted/20">
                                    <div className="size-10 bg-muted rounded-lg flex items-center justify-center">{!p.imageUrl && <Coffee className="size-4 opacity-50"/>}</div>
                                    <div className="flex-1"><p className="font-bold text-sm">{p.name}</p><p className="text-xs text-primary">{formatRupiah(p.price)}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab === "report" && (
                    <div className="p-10 text-center text-muted-foreground text-sm font-medium">Laporan akan segera hadir</div>
                )}
            </div>
        </div>
    );
}
