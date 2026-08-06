import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Download, FileText, TrendingUp, ReceiptText, Store, Coins, Package, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function formatRupiah(num) { return "Rp " + Number(num).toLocaleString("id-ID"); }

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const PAYMENT_LABELS = { cash: "Tunai", card: "Kartu", qris: "QRIS" };

export default function Reports() {
    const [from, setFrom] = useState(todayStr());
    const [to, setTo] = useState(todayStr());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reports?from=${from}&to=${to}`);
            const result = await res.json();
            if (result.success) setData(result.data);
            else toast.error(result.error || "Gagal memuat laporan");
        } catch (e) {
            toast.error("Terjadi kesalahan jaringan");
        }
        setLoading(false);
    }, [from, to]);

    useEffect(() => { load(); }, [load]);

    const exportCSV = () => {
        if (!data) return;
        const rows = [
            ["Laporan Penjualan", `${from} s/d ${to}`],
            [],
            ["Ringkasan"],
            ["Total Transaksi", data.summary.totalOrders],
            ["Total Penjualan", data.summary.totalSales],
            ["Total Item Terjual", data.summary.totalItems],
            ["Rata-rata / Transaksi", data.summary.averageOrder],
            ...Object.entries(data.summary.paymentBreakdown).map(([k, v]) => [`Penjualan ${PAYMENT_LABELS[k] || k}`, v]),
            [],
            ["Produk Terlaris"],
            ["Rank", "Produk", "Qty", "Pendapatan"],
            ...data.topProducts.map(p => [p.rank, p.name, p.quantity, p.revenue]),
            [],
            ["Detail Transaksi"],
            ["No", "Nomor", "Waktu", "Metode", "Total"],
            ...data.orders.map((o, i) => [i + 1, o.orderNumber, new Date(o.createdAt).toLocaleString("id-ID"), o.paymentMethod, o.total])
        ];
        const csv = rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan-${from}-sampai-${to}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportPDF = async () => {
        if (!data) return;
        const { jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Laporan Penjualan", 14, 20);
        doc.setFontSize(10);
        doc.text(`${from} s/d ${to}`, 14, 27);

        autoTable(doc, {
            startY: 32,
            head: [["Ringkasan", "Nilai"]],
            body: [
                ["Total Transaksi", String(data.summary.totalOrders)],
                ["Total Penjualan", formatRupiah(data.summary.totalSales)],
                ["Total Item Terjual", String(data.summary.totalItems)],
                ["Rata-rata / Transaksi", formatRupiah(data.summary.averageOrder)],
                ...Object.entries(data.summary.paymentBreakdown).map(([k, v]) => [`Penjualan ${PAYMENT_LABELS[k] || k}`, formatRupiah(v)])
            ]
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["Rank", "Produk", "Qty", "Pendapatan"]],
            body: data.topProducts.map(p => [p.rank, p.name, String(p.quantity), formatRupiah(p.revenue)])
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["No", "Nomor", "Waktu", "Metode", "Total"]],
            body: data.orders.map((o, i) => [String(i + 1), o.orderNumber, new Date(o.createdAt).toLocaleString("id-ID"), o.paymentMethod, formatRupiah(o.total)])
        });

        doc.save(`laporan-${from}-sampai-${to}.pdf`);
    };

    const handleExport = async (type) => {
        setExporting(type);
        try {
            if (type === "csv") exportCSV();
            else await exportPDF();
        } catch (e) {
            toast.error("Gagal membuat file export");
        }
        setExporting(null);
    };

    const summary = data?.summary;

    return (
        <div className="flex flex-col min-h-full pb-4">
            <div className="px-4 pt-4 pb-2 bg-background sticky top-0 z-10 space-y-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-black">Laporan</h1>
                    <Button variant="ghost" size="icon" onClick={load}><RefreshCw className="size-4" /></Button>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 bg-muted/50 rounded-xl p-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase px-1">Dari</label>
                        <input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none" />
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-xl p-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase px-1">Sampai</label>
                        <input type="date" value={to} min={from} onChange={e => setTo(e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-9" variant="outline" onClick={() => handleExport("csv")} disabled={!data || !!exporting}>
                        <Download className="size-3.5 mr-1.5" /> {exporting === "csv" ? "..." : "CSV"}
                    </Button>
                    <Button size="sm" className="flex-1 h-9" variant="outline" onClick={() => handleExport("pdf")} disabled={!data || !!exporting}>
                        <FileText className="size-3.5 mr-1.5" /> {exporting === "pdf" ? "..." : "PDF"}
                    </Button>
                </div>
            </div>

            <div className="px-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="bg-card rounded-2xl border p-4">
                                <Wallet className="size-4 text-primary mb-2" />
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Penjualan</p>
                                <p className="font-black text-base mt-0.5 truncate">{formatRupiah(summary?.totalSales || 0)}</p>
                            </div>
                            <div className="bg-card rounded-2xl border p-4">
                                <ReceiptText className="size-4 text-primary mb-2" />
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Transaksi</p>
                                <p className="font-black text-base mt-0.5">{summary?.totalOrders || 0}</p>
                            </div>
                            <div className="bg-card rounded-2xl border p-4">
                                <TrendingUp className="size-4 text-primary mb-2" />
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Rata-rata</p>
                                <p className="font-black text-base mt-0.5 truncate">{formatRupiah(summary?.averageOrder || 0)}</p>
                            </div>
                            <div className="bg-card rounded-2xl border p-4">
                                <Package className="size-4 text-primary mb-2" />
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Item Terjual</p>
                                <p className="font-black text-base mt-0.5">{summary?.totalItems || 0}</p>
                            </div>
                        </div>

                        {summary?.paymentBreakdown && Object.keys(summary.paymentBreakdown).length > 0 && (
                            <div className="bg-card rounded-2xl border p-4 space-y-2">
                                <h3 className="font-bold text-sm flex items-center gap-2"><Coins className="size-4 text-primary" /> Metode Pembayaran</h3>
                                {Object.entries(summary.paymentBreakdown).map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{PAYMENT_LABELS[k] || k}</span>
                                        <span className="font-bold">{formatRupiah(v)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-card rounded-2xl border overflow-hidden">
                            <h3 className="font-bold text-sm p-4 pb-2 flex items-center gap-2"><TrendingUp className="size-4 text-primary" /> Produk Terlaris</h3>
                            {data?.topProducts?.length ? (
                                <div className="divide-y">
                                    {data.topProducts.map(p => (
                                        <div key={p.name} className="flex items-center gap-3 px-4 py-3">
                                            <span className={`size-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${p.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{p.rank}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{p.name}</p>
                                                <p className="text-xs text-muted-foreground">{p.quantity}x terjual</p>
                                            </div>
                                            <span className="font-black text-sm text-primary">{formatRupiah(p.revenue)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm font-medium">Belum ada penjualan di periode ini</div>
                            )}
                        </div>

                        {data?.orders?.length > 0 && (
                            <div className="bg-card rounded-2xl border p-4 space-y-2">
                                <h3 className="font-bold text-sm flex items-center gap-2"><Store className="size-4 text-primary" /> Transaksi</h3>
                                <div className="divide-y">
                                    {data.orders.map(o => (
                                        <div key={o.id} className="py-2 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-sm">#{o.orderNumber}</p>
                                                <p className="text-[11px] text-muted-foreground">{new Date(o.createdAt).toLocaleString("id-ID")} · {PAYMENT_LABELS[o.paymentMethod] || o.paymentMethod}</p>
                                            </div>
                                            <span className="font-black text-sm">{formatRupiah(o.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}