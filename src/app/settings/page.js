"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/components/SettingsProvider";

export default function Settings() {
    const {
        storeName: ctxStoreName,
        contactNumber: ctxContactNumber,
        address: ctxAddress,
        autoPrint: ctxAutoPrint,
        receiptFooter: ctxReceiptFooter,
        taxRates: ctxTaxRates,
        paymentMethods: ctxPaymentMethods,
        theme: ctxTheme,
        saveSettings
    } = useSettings();

    const [storeName, setStoreName] = useState(ctxStoreName);
    const [contactNumber, setContactNumber] = useState(ctxContactNumber);
    const [address, setAddress] = useState(ctxAddress);
    const [autoPrint, setAutoPrint] = useState(ctxAutoPrint);
    const [receiptFooter, setReceiptFooter] = useState(ctxReceiptFooter);
    const [taxRates, setTaxRates] = useState(ctxTaxRates);
    const [paymentMethods, setPaymentMethods] = useState(ctxPaymentMethods);
    const [theme, setTheme] = useState(ctxTheme);

    // Sync when context loads from local storage
    useEffect(() => {
        setStoreName(ctxStoreName);
        setContactNumber(ctxContactNumber);
        setAddress(ctxAddress);
        setAutoPrint(ctxAutoPrint);
        setReceiptFooter(ctxReceiptFooter);
        setTaxRates(ctxTaxRates);
        setPaymentMethods(ctxPaymentMethods);
        setTheme(ctxTheme);
    }, [ctxStoreName, ctxContactNumber, ctxAddress, ctxAutoPrint, ctxReceiptFooter, ctxTaxRates, ctxPaymentMethods, ctxTheme]);

    const handleSave = () => {
        saveSettings({
            storeName,
            contactNumber,
            address,
            autoPrint,
            receiptFooter,
            taxRates,
            paymentMethods,
            theme
        });
        alert("System configuration saved successfully!");
    };

    const handleDiscard = () => {
        setStoreName(ctxStoreName);
        setContactNumber(ctxContactNumber);
        setAddress(ctxAddress);
        setAutoPrint(ctxAutoPrint);
        setReceiptFooter(ctxReceiptFooter);
        setTaxRates(ctxTaxRates);
        setPaymentMethods(ctxPaymentMethods);
        setTheme(ctxTheme);
    };

    const togglePaymentMethod = (id) => {
        setPaymentMethods(paymentMethods.map(pm =>
            pm.id === id ? { ...pm, active: !pm.active } : pm
        ));
    };

    const updateTaxRate = (id, newRate) => {
        setTaxRates(taxRates.map(tr =>
            tr.id === id ? { ...tr, rate: newRate === '' ? '' : parseFloat(newRate) } : tr
        ));
    };

    return (
        <main className="flex-1 flex flex-col overflow-y-auto">
            <header className="flex items-center justify-between border-b border-primary/10 dark:border-zinc-800 px-4 pl-14 lg:px-8 py-4 bg-white dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">System Configuration</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-white dark:bg-zinc-950 border border-primary/10 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 ">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button onClick={handleSave} className="flex items-center justify-center rounded-xl h-10 px-4 bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
                        Save Changes
                    </button>
                </div>
            </header>
            <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full space-y-8 lg:space-y-10">
                {/* Store Profile Section */}
                <section>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Store Profile</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 ">Basic information about your cafe location.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-primary/10 dark:border-zinc-800 shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-200 ">Store Name</label>
                            <input
                                className="w-full rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/20 p-3 text-sm"
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-200 ">Contact Number</label>
                            <input
                                className="w-full rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/20 p-3 text-sm"
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-200 ">Address</label>
                            <input
                                className="w-full rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/20 p-3 text-sm"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>
                </section>
                {/* Appearance Section */}
                <section>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Appearance</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 ">Customize the look and feel of your POS.</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-primary/10 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-lg cursor-pointer" onClick={() => {
                            const newTheme = theme === 'dark' ? 'light' : 'dark';
                            setTheme(newTheme);
                            saveSettings({
                                storeName,
                                contactNumber,
                                address,
                                autoPrint,
                                receiptFooter,
                                taxRates,
                                paymentMethods,
                                theme: newTheme
                            });
                        }}>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
                                <div>
                                    <p className="text-sm font-semibold">Dark Mode</p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">Toggle dark theme across the application</p>
                                </div>
                            </div>
                            <button
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}></span>
                            </button>
                        </div>
                    </div>
                </section>
                {/* Receipt Printing Section */}
                <section>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Receipt Printing</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 ">Configure how receipts are printed and displayed.</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-primary/10 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">print</span>
                                <div>
                                    <p className="text-sm font-semibold">Auto-print receipts</p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">Print receipt automatically after payment</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAutoPrint(!autoPrint)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoPrint ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 transition-transform ${autoPrint ? 'translate-x-6' : 'translate-x-1'}`}></span>
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-200 ">Receipt Footer Text</label>
                            <textarea
                                className="w-full rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/20 p-3 text-sm h-24"
                                value={receiptFooter}
                                onChange={(e) => setReceiptFooter(e.target.value)}
                            />
                        </div>
                    </div>
                </section>
                {/* Tax Rates & Payment Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tax Rates */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Tax Rates (%)</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 ">Manage sales tax for different items.</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-primary/10 dark:border-zinc-800 shadow-sm space-y-4">
                            {taxRates.map(tr => (
                                <div key={tr.id} className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium">{tr.name}</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="w-20 rounded-lg border-primary/20 bg-background-light dark:bg-background-dark py-2 px-3 text-sm text-right focus:border-primary focus:ring-primary/20"
                                            type="number"
                                            value={tr.rate}
                                            onChange={(e) => updateTaxRate(tr.id, e.target.value)}
                                        />
                                        <span className="text-slate-500 dark:text-zinc-400">%</span>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2 border-2 border-dashed border-primary/20 rounded-lg text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                                + Add Tax Category
                            </button>
                        </div>
                    </section>
                    {/* Payment Methods */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Payment Methods</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 ">Accepted ways to pay.</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-primary/10 dark:border-zinc-800 shadow-sm space-y-3">
                            {paymentMethods.map(pm => (
                                <div key={pm.id} onClick={() => togglePaymentMethod(pm.id)} className={`cursor-pointer flex items-center justify-between p-2 rounded-lg border transition-colors ${pm.active ? 'border-primary/10 dark:border-zinc-800 bg-primary/5' : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:bg-zinc-900'}`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-sm ${pm.active ? 'text-primary' : 'text-slate-400 dark:text-zinc-400'}`}>{pm.icon}</span>
                                        <span className={`text-sm font-medium ${pm.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`}>{pm.name}</span>
                                    </div>
                                    {pm.active ? (
                                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-slate-300 text-xl">radio_button_unchecked</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="flex justify-end pt-6 border-t border-primary/10 dark:border-zinc-800">
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <button onClick={handleDiscard} className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-all">
                            Discard Changes
                        </button>
                        <button onClick={handleSave} className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Save System Configuration
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
