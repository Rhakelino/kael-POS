import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Products() {
    return (
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">Products Management</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your cafe&apos;s menu items and stock levels</p>
                    </div>
                    <Button className="flex items-center gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
                        <Plus className="size-4" />
                        Add New Product
                    </Button>
                </div>

                {/* Filters and Search */}
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                className="w-full pl-9 pr-4 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:ring-primary text-foreground"
                                placeholder="Search product name or SKU..."
                                type="text"
                            />
                        </div>
                        {/* Category Quick Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
                            <Button className="rounded-lg h-11 px-5 font-bold">All</Button>
                            <Button variant="secondary" className="rounded-lg h-11 px-5 font-medium bg-muted text-muted-foreground hover:text-foreground">Coffee</Button>
                            <Button variant="secondary" className="rounded-lg h-11 px-5 font-medium bg-muted text-muted-foreground hover:text-foreground">Non-Coffee</Button>
                            <Button variant="secondary" className="rounded-lg h-11 px-5 font-medium bg-muted text-muted-foreground hover:text-foreground">Pastry</Button>
                            <Button variant="secondary" className="rounded-lg h-11 px-5 font-medium bg-muted text-muted-foreground hover:text-foreground">Main Course</Button>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="font-semibold text-muted-foreground h-12">Product</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12">Category</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12">Price</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12">Stock Status</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground text-right h-12">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Product Row 1 */}
                                <TableRow className="hover:bg-muted/50 border-border group transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-border" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABhYBOP5ujB13lX-GZqzCCbhDIju5RZ6USs0CH0TP5XSsBCENwWAmAz5yO5YlIAbdvv4UpofPoz0F4axqkzCgiaYBgEkkO7ovHIudik-2VGRAex3EqzPlXOkoZcYyTO9XReLq4e0vg6NJAP6EkM1G_VbtcV6aAU9bTvgH9yvrrd928jHv24fx6v-Rnbd0sD2TvLybn2oP3F1amj3WLC-UPD68Lk7tYdxMhWnbCMTtk6T5YOCqua37Zw3Ixom_KZnTqvvyjhNaW49ti')" }}></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">Classic Espresso</span>
                                                <span className="text-xs text-muted-foreground">SKU: ESP-001</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-bold uppercase text-[10px]">Coffee</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-foreground">Rp 25.000</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <span className="size-2 rounded-full bg-emerald-500 shrink-0"></span>
                                            <span className="text-sm font-medium">In Stock (124)</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 size-8">
                                                <Edit2 className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Product Row 2 */}
                                <TableRow className="hover:bg-muted/50 border-border group transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-border" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6Blg0KPFs-GbEB8xjuFwFaPgx_XqB49oe8bvIMQQdPjPka73QyrMBBEUpu9Ad0D7_vJ4WekUX3I6U_9PNtrK-M56by8QmNDhESClk_uj9TKZRBWPbaCoSxYmG9Fi4UfUKndnIc2EELU275ZyghVB1CrBGGIW7dOz-oLS0zgC5rqtQptaE9eebChmNZu3nQWfVWouS7TvDVghC6GUm-ke7syMwiAceypfst77rbdNHLQms0aQjIjoi_vAYpQ-vNiGW8NtrgMG1vJcv')" }}></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">Butter Croissant</span>
                                                <span className="text-xs text-muted-foreground">SKU: PST-012</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 font-bold uppercase text-[10px]">Pastry</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-foreground">Rp 18.000</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-amber-500">
                                            <span className="size-2 rounded-full bg-amber-500 shrink-0"></span>
                                            <span className="text-sm font-medium">Low Stock (8)</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 size-8">
                                                <Edit2 className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Product Row 3 */}
                                <TableRow className="hover:bg-muted/50 border-border group transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-border" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvAtHBSk-xxEkLlNAfaZ21t98hFqhpCMFp2dntbP-J-yXFsHGUT2tI9t0l82gCdmL9H5WSK2kNj0T_x-18gkZXizzek0tTdAp5seiPjYnTTL5qjGz5Z7QjtgUMaZPUQ8KJYHb5HnTCxxj2gTwwf7xnKBEFoyFxxQhx21JsCDZWLI9qMltm2gPzZJwWYY3LWD9mr3lfka-G1LJPH_K3EOzwXDzU_m4iI7fQGXZmryw_eyiCQ80F0Bk-Ez3S4A7SdKPb5VepMzUFU8Wf')" }}></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">Iced Hazelnut Latte</span>
                                                <span className="text-xs text-muted-foreground">SKU: ESP-044</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-bold uppercase text-[10px]">Coffee</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-foreground">Rp 32.000</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <span className="size-2 rounded-full bg-emerald-500 shrink-0"></span>
                                            <span className="text-sm font-medium">In Stock (45)</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 size-8">
                                                <Edit2 className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Product Row 4 */}
                                <TableRow className="hover:bg-muted/50 border-border group transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-4 opacity-50">
                                            <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-border grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIrniXdvFsseSGN5gKkD-MA0KTcYjSEr8Q7SqmreLSPekkptD0KguSl3zr6tp0ajZiQWwxsusBUex7-q9gC29qSWnyfO5_Ffz3ATJodn3Ky9xSTp_wz3BwLtoceAJ2O7JE72eDTiPv5wakAoRNTJOXQSrsvPMWN1cPEQlwfB025sFqQQaSXrihUMVVLKm4oXGEI-qU2ExMwzl2U-TT4S9bDQPh4CkBd1XyOPxYOPr0sJTrL_u3iu8kgifl8PUNhXEUIUBdpPQBL6Ub')" }}></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-muted-foreground">Matcha Breakfast Bowl</span>
                                                <span className="text-xs text-muted-foreground">SKU: NCB-005</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-muted-foreground font-bold uppercase text-[10px]">Non-Coffee</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-muted-foreground">Rp 45.000</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <span className="size-2 rounded-full bg-muted-foreground shrink-0"></span>
                                            <span className="text-sm font-medium">Out of Stock</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 size-8">
                                                <Edit2 className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Product Row 5 */}
                                <TableRow className="hover:bg-muted/50 border-border group transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-border" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPvv5O6I_6ma_hwGtdEssmV-CsgeitA7YDul1gsWXdjwgpGWYbE6gByQENLuWMsTpFhkm-kVe0JjrlSz2e1jTdo-jqgxfsh-qMDe0VLy5SSGnrpyb9uly6PFCVytA5TQdOz0meseyq6hmGp2VV9VI-g5q1XS0Ypc4EFRVO6cWRrEhkEKC_RHU8pOC5pNU8cbjPQWAyNIgLiZkP0-cwuJV3NfZPbBTDid07BCZaHkrys0t06ZLEUk4uDZVsPwbmmI8Xy3FkzGzpjcvl')" }}></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">Creamy Carbonara</span>
                                                <span className="text-xs text-muted-foreground">SKU: MNC-091</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-bold uppercase text-[10px]">Main Course</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-foreground">Rp 55.000</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <span className="size-2 rounded-full bg-emerald-500 shrink-0"></span>
                                            <span className="text-sm font-medium">In Stock (32)</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 size-8">
                                                <Edit2 className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination/Footer Information */}
                    <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground font-medium">Showing 1 to 5 of 42 products</p>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" disabled className="size-8 rounded-lg bg-background">
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button variant="default" className="size-8 rounded-lg font-bold">1</Button>
                            <Button variant="ghost" className="size-8 rounded-lg font-medium text-muted-foreground hover:text-foreground">2</Button>
                            <Button variant="ghost" className="size-8 rounded-lg font-medium text-muted-foreground hover:text-foreground">3</Button>
                            <Button variant="outline" size="icon" className="size-8 rounded-lg bg-background">
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
