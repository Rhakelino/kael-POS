import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Loader2, Receipt, Check, CheckCheck, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function formatRupiah(num) { return "Rp " + Number(num).toLocaleString("id-ID"); }

const STATUS = {
    new: { label: "Baru", bg: "bg-blue-500/10", text: "text-blue-600", action: "Terima", next: "preparing" },
    preparing: { label: "Diproses", bg: "bg-amber-500/10", text: "text-amber-600", action: "Siap", next: "ready" },
    ready: { label: "Siap", bg: "bg-emerald-500/10", text: "text-emerald-600", action: "Selesai", next: "completed" },
    completed: { label: "Selesai", bg: "bg-muted", text: "text-muted-foreground", action: null }
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [receipt, setReceipt] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (data.success) setOrders(data.data);
        } catch(e){}
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        await fetch(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
        await load();
        setUpdating(null);
    };

    const filtered = orders.filter(o => filter ? o.status === filter : true);

    return (
        <div className="flex flex-col min-h-full">
            <div className="px-4 pt-4 pb-2 bg-background sticky top-0 z-10 flex justify-between items-center"><h1 className="text-lg font-black">Pesanan</h1><Button variant="ghost" size="icon" onClick={load}><RefreshCw className="size-4" /></Button></div>
            <div className="px-4 py-2 sticky top-[60px] bg-background z-10">
                <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-1">
                        <button onClick={() => setFilter(null)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${!filter ? "bg-primary text-white" : "bg-muted"}`}>Semua</button>
                        {Object.entries(STATUS).map(([k, v]) => (
                            <button key={k} onClick={() => setFilter(k)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter === k ? "bg-primary text-white" : "bg-muted"}`}>{v.label}</button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden"/>
                </ScrollArea>
            </div>
            <div className="flex-1 px-4 pb-4 space-y-3">
                {loading ? <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div> : filtered.map(o => {
                    const c = STATUS[o.status];
                    return (
                        <div key={o.id} className={`bg-card border rounded-2xl p-4 ${o.status === 'completed' ? 'opacity-60' : ''}`}>
                            <div className="flex justify-between mb-2">
                                <span className="font-black">#{o.orderNumber}</span>
                                <Badge variant="secondary" className={`border-0 ${c.bg} ${c.text}`}>{c.label}</Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                                {o.items.map(i => <div key={i.id} className="text-sm flex justify-between"><span className="text-muted-foreground">{i.quantity}x {i.productName}</span><span className="font-medium">{formatRupiah(i.subtotal)}</span></div>)}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t">
                                <span className="font-black text-lg">{formatRupiah(o.total)}</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setReceipt(o)}>
                                        <Receipt className="size-4 mr-1" /> Struk
                                    </Button>
                                    {c.action && <Button size="sm" onClick={() => updateStatus(o.id, c.next)} disabled={updating === o.id}>{updating === o.id ? "..." : c.action}</Button>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Dialog open={!!receipt} onOpenChange={(o) => { if (!o) setReceipt(null); }}>
                <DialogContent className="sm:max-w-sm p-6 text-center">
                    <div id="receipt-print-area" className="p-4 bg-white text-black font-mono text-xs rounded-lg text-left space-y-3">
                        <div className="text-center border-b pb-3">
                            <h2 className="font-bold text-base uppercase">Kael Cafe</h2>
                            <p className="text-[10px] text-gray-500">Struk Pembayaran</p>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600">
                            <span>No: #{receipt?.orderNumber}</span>
                            <span>{receipt?.createdAt ? new Date(receipt.createdAt).toLocaleString("id-ID") : ""}</span>
                        </div>
                        <div className="border-b border-t py-2 space-y-1">
                            {receipt?.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{item.quantity}x {item.productName}</span>
                                    <span>{formatRupiah(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{formatRupiah(receipt?.total || 0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="capitalize">Bayar ({receipt?.paymentMethod || "cash"})</span>
                                <span>{formatRupiah(receipt?.amountPaid || receipt?.total || 0)}</span>
                            </div>
                            {receipt?.paymentMethod === "cash" && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Kembali</span>
                                    <span>{formatRupiah(receipt?.changeAmount || 0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center border-t pt-3 text-[10px] text-gray-500">
                            <p>Terima Kasih atas Kunjungan Anda!</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button onClick={() => window.print()} className="flex-1 font-bold flex gap-2 items-center justify-center">
                            <Receipt className="size-4" /> Cetak Struk
                        </Button>
                        <Button variant="outline" onClick={() => setReceipt(null)} className="flex-1">Tutup</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
