export default function Products() {
    return (
        <main className="flex-1 overflow-y-auto bg-background-light p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Products Management</h2>
                        <p className="text-slate-500">Manage your cafe&apos;s menu items and stock levels</p>
                    </div>
                    <button className="bg-primary text-white flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        <span className="material-symbols-outlined">add</span>
                        Add New Product
                    </button>
                </div>
                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-2xl border border-primary/5 shadow-sm space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="w-full pl-12 pr-4 py-3 rounded-xl bg-background-light border-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400" placeholder="Search product name or SKU..." type="text" />
                        </div>
                        {/* Category Quick Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                            <button className="px-5 py-2 rounded-lg bg-primary text-white font-medium whitespace-nowrap">All</button>
                            <button className="px-5 py-2 rounded-lg bg-primary/5 text-slate-600 hover:bg-primary/10 font-medium whitespace-nowrap">Coffee</button>
                            <button className="px-5 py-2 rounded-lg bg-primary/5 text-slate-600 hover:bg-primary/10 font-medium whitespace-nowrap">Non-Coffee</button>
                            <button className="px-5 py-2 rounded-lg bg-primary/5 text-slate-600 hover:bg-primary/10 font-medium whitespace-nowrap">Pastry</button>
                            <button className="px-5 py-2 rounded-lg bg-primary/5 text-slate-600 hover:bg-primary/10 font-medium whitespace-nowrap">Main Course</button>
                        </div>
                    </div>
                </div>
                {/* Table Container */}
                <div className="bg-white rounded-2xl border border-primary/5 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-primary/5">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Product</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stock Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {/* Product Row 1 */}
                            <tr className="hover:bg-primary/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" data-alt="A classic dark brown espresso in a ceramic cup" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABhYBOP5ujB13lX-GZqzCCbhDIju5RZ6USs0CH0TP5XSsBCENwWAmAz5yO5YlIAbdvv4UpofPoz0F4axqkzCgiaYBgEkkO7ovHIudik-2VGRAex3EqzPlXOkoZcYyTO9XReLq4e0vg6NJAP6EkM1G_VbtcV6aAU9bTvgH9yvrrd928jHv24fx6v-Rnbd0sD2TvLybn2oP3F1amj3WLC-UPD68Lk7tYdxMhWnbCMTtk6T5YOCqua37Zw3Ixom_KZnTqvvyjhNaW49ti')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">Classic Espresso</span>
                                            <span className="text-xs text-slate-400">SKU: ESP-001</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">Coffee</span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-700">Rp 25.000</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                        <span className="text-sm font-medium">In Stock (124)</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Product Row 2 */}
                            <tr className="hover:bg-primary/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" data-alt="A flaky golden butter croissant on a plate" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6Blg0KPFs-GbEB8xjuFwFaPgx_XqB49oe8bvIMQQdPjPka73QyrMBBEUpu9Ad0D7_vJ4WekUX3I6U_9PNtrK-M56by8QmNDhESClk_uj9TKZRBWPbaCoSxYmG9Fi4UfUKndnIc2EELU275ZyghVB1CrBGGIW7dOz-oLS0zgC5rqtQptaE9eebChmNZu3nQWfVWouS7TvDVghC6GUm-ke7syMwiAceypfst77rbdNHLQms0aQjIjoi_vAYpQ-vNiGW8NtrgMG1vJcv')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">Butter Croissant</span>
                                            <span className="text-xs text-slate-400">SKU: PST-012</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase">Pastry</span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-700">Rp 18.000</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-amber-600">
                                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                        <span className="text-sm font-medium">Low Stock (8)</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Product Row 3 */}
                            <tr className="hover:bg-primary/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" data-alt="Tall glass of iced latte with milk swirls" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvAtHBSk-xxEkLlNAfaZ21t98hFqhpCMFp2dntbP-J-yXFsHGUT2tI9t0l82gCdmL9H5WSK2kNj0T_x-18gkZXizzek0tTdAp5seiPjYnTTL5qjGz5Z7QjtgUMaZPUQ8KJYHb5HnTCxxj2gTwwf7xnKBEFoyFxxQhx21JsCDZWLI9qMltm2gPzZJwWYY3LWD9mr3lfka-G1LJPH_K3EOzwXDzU_m4iI7fQGXZmryw_eyiCQ80F0Bk-Ez3S4A7SdKPb5VepMzUFU8Wf')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">Iced Hazelnut Latte</span>
                                            <span className="text-xs text-slate-400">SKU: ESP-044</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">Coffee</span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-700">Rp 32.000</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                        <span className="text-sm font-medium">In Stock (45)</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Product Row 4 */}
                            <tr className="hover:bg-primary/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 opacity-50 grayscale" data-alt="A vibrant green matcha bowl with toppings" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIrniXdvFsseSGN5gKkD-MA0KTcYjSEr8Q7SqmreLSPekkptD0KguSl3zr6tp0ajZiQWwxsusBUex7-q9gC29qSWnyfO5_Ffz3ATJodn3Ky9xSTp_wz3BwLtoceAJ2O7JE72eDTiPv5wakAoRNTJOXQSrsvPMWN1cPEQlwfB025sFqQQaSXrihUMVVLKm4oXGEI-qU2ExMwzl2U-TT4S9bDQPh4CkBd1XyOPxYOPr0sJTrL_u3iu8kgifl8PUNhXEUIUBdpPQBL6Ub')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-400">Matcha Breakfast Bowl</span>
                                            <span className="text-xs text-slate-400">SKU: NCB-005</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-xs font-bold uppercase">Non-Coffee</span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-400">Rp 45.000</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                        <span className="text-sm font-medium">Out of Stock</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Product Row 5 */}
                            <tr className="hover:bg-primary/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" data-alt="Plate of creamy carbonara pasta with herbs" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPvv5O6I_6ma_hwGtdEssmV-CsgeitA7YDul1gsWXdjwgpGWYbE6gByQENLuWMsTpFhkm-kVe0JjrlSz2e1jTdo-jqgxfsh-qMDe0VLy5SSGnrpyb9uly6PFCVytA5TQdOz0meseyq6hmGp2VV9VI-g5q1XS0Ypc4EFRVO6cWRrEhkEKC_RHU8pOC5pNU8cbjPQWAyNIgLiZkP0-cwuJV3NfZPbBTDid07BCZaHkrys0t06ZLEUk4uDZVsPwbmmI8Xy3FkzGzpjcvl')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">Creamy Carbonara</span>
                                            <span className="text-xs text-slate-400">SKU: MNC-091</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">Main Course</span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-700">Rp 55.000</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                        <span className="text-sm font-medium">In Stock (32)</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Pagination/Footer Information */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 px-2">
                    <p>Showing 1 to 5 of 42 products</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-white border border-primary/5 hover:bg-primary/5 transition-colors disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white font-medium flex items-center justify-center">1</button>
                        <button className="w-8 h-8 rounded-lg bg-white border border-primary/5 hover:bg-primary/5 transition-colors flex items-center justify-center">2</button>
                        <button className="w-8 h-8 rounded-lg bg-white border border-primary/5 hover:bg-primary/5 transition-colors flex items-center justify-center">3</button>
                        <button className="p-2 rounded-lg bg-white border border-primary/5 hover:bg-primary/5 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
