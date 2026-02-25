export default function Settings() {
    return (
        <main className="flex-1 flex flex-col overflow-y-auto">
            <header className="flex items-center justify-between border-b border-primary/10 px-4 pl-14 lg:px-8 py-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h2 className="text-slate-900 text-xl font-bold tracking-tight">System Configuration</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-white border border-primary/10 text-slate-600 ">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="flex items-center justify-center rounded-xl h-10 px-4 bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
                        Save Changes
                    </button>
                </div>
            </header>
            <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full space-y-8 lg:space-y-10">
                {/* Store Profile Section */}
                <section>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 ">Store Profile</h3>
                        <p className="text-sm text-slate-500 ">Basic information about your cafe location.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ">Store Name</label>
                            <input className="w-full rounded-lg border-primary/20 bg-background-light focus:border-primary focus:ring-primary/20 p-3 text-sm" type="text" defaultValue="The Roasted Bean" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ">Contact Number</label>
                            <input className="w-full rounded-lg border-primary/20 bg-background-light focus:border-primary focus:ring-primary/20 p-3 text-sm" type="text" defaultValue="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 ">Address</label>
                            <input className="w-full rounded-lg border-primary/20 bg-background-light focus:border-primary focus:ring-primary/20 p-3 text-sm" type="text" defaultValue="123 Espresso Way, Coffee City, CC 90210" />
                        </div>
                    </div>
                </section>
                {/* Receipt Printing Section */}
                <section>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 ">Receipt Printing</h3>
                        <p className="text-sm text-slate-500 ">Configure how receipts are printed and displayed.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-4">
                        <div className="flex items-center justify-between p-3 bg-background-light rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">print</span>
                                <div>
                                    <p className="text-sm font-semibold">Auto-print receipts</p>
                                    <p className="text-xs text-slate-500">Print receipt automatically after payment</p>
                                </div>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ">Receipt Footer Text</label>
                            <textarea className="w-full rounded-lg border-primary/20 bg-background-light focus:border-primary focus:ring-primary/20 p-3 text-sm h-24" defaultValue="Thank you for visiting! Follow us on Instagram @roastedbean_cafe" />
                        </div>
                    </div>
                </section>
                {/* Tax Rates & Payment Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tax Rates */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900 ">Tax Rates (%)</h3>
                            <p className="text-sm text-slate-500 ">Manage sales tax for different items.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm font-medium">Standard Sales Tax</span>
                                <div className="flex items-center gap-2">
                                    <input className="w-20 rounded-lg border-primary/20 bg-background-light p-2 text-sm text-right" type="number" defaultValue="8.5" />
                                    <span className="text-slate-500">%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm font-medium">Prepared Food Tax</span>
                                <div className="flex items-center gap-2">
                                    <input className="w-20 rounded-lg border-primary/20 bg-background-light p-2 text-sm text-right" type="number" defaultValue="10.0" />
                                    <span className="text-slate-500">%</span>
                                </div>
                            </div>
                            <button className="w-full py-2 border-2 border-dashed border-primary/20 rounded-lg text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                                + Add Tax Category
                            </button>
                        </div>
                    </section>
                    {/* Payment Methods */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900 ">Payment Methods</h3>
                            <p className="text-sm text-slate-500 ">Accepted ways to pay.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-3">
                            <div className="flex items-center justify-between p-2 rounded-lg border border-primary/5 bg-primary/5">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">payments</span>
                                    <span className="text-sm font-medium">Cash</span>
                                </div>
                                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg border border-primary/5 bg-primary/5">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">credit_card</span>
                                    <span className="text-sm font-medium">Credit/Debit Card</span>
                                </div>
                                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-slate-400">account_balance_wallet</span>
                                    <span className="text-sm font-medium">Digital Wallets</span>
                                </div>
                                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-200 ">
                                    <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-1"></span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="flex justify-end pt-6 border-t border-primary/10">
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-all">
                            Discard Changes
                        </button>
                        <button className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Save System Configuration
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
