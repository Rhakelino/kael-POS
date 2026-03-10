"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/components/SettingsProvider";

import {
    Bell,
    Moon,
    Sun,
    Printer,
    CheckCircle2,
    Circle,
    Plus,
    Save,
    RotateCcw
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
        toast.success("Settings saved", {
            description: "System configuration saved successfully!"
        });
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
        toast.info("Changes discarded", {
            description: "Reverted to previous settings."
        });
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
        <main className="flex-1 flex flex-col overflow-y-auto bg-background">
            <header className="flex items-center justify-between border-b border-border px-4 pl-14 lg:px-8 py-4 bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h2 className="text-foreground text-xl lg:text-2xl font-bold tracking-tight">System Settings</h2>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <Button variant="outline" size="icon" className="rounded-xl size-10 bg-card border-border text-muted-foreground">
                        <Bell className="size-4" />
                    </Button>
                    <Button onClick={handleSave} className="rounded-xl px-4 font-bold shadow-md shadow-primary/20">
                        <Save className="size-4 mr-2 hidden sm:block" />
                        Save Changes
                    </Button>
                </div>
            </header>

            <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
                {/* Store Profile Section */}
                <Card className="border-border shadow-sm bg-card">
                    <CardHeader>
                        <CardTitle>Store Profile</CardTitle>
                        <CardDescription>Basic information about your cafe location.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactNumber">Contact Number</Label>
                            <Input
                                id="contactNumber"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="bg-muted/50"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Section */}
                <Card className="border-border shadow-sm bg-card">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of your POS.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors border border-border"
                            onClick={() => {
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
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-background rounded-lg border border-border text-primary shadow-sm">
                                    {theme === 'dark' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Dark Mode</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Toggle dark theme across the application</p>
                                </div>
                            </div>
                            <Switch checked={theme === 'dark'} />
                        </div>
                    </CardContent>
                </Card>

                {/* Receipt Printing Section */}
                <Card className="border-border shadow-sm bg-card">
                    <CardHeader>
                        <CardTitle>Receipt Printing</CardTitle>
                        <CardDescription>Configure how receipts are printed and displayed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors border border-border"
                            onClick={() => setAutoPrint(!autoPrint)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-background rounded-lg border border-border text-primary shadow-sm">
                                    <Printer className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Auto-print receipts</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Print receipt automatically after payment</p>
                                </div>
                            </div>
                            <Switch checked={autoPrint} onCheckedChange={setAutoPrint} />
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                            <Textarea
                                id="receiptFooter"
                                value={receiptFooter}
                                onChange={(e) => setReceiptFooter(e.target.value)}
                                className="h-24 bg-muted/50 resize-y"
                                placeholder="Thank you for visiting!"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tax Rates & Payment Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tax Rates */}
                    <Card className="border-border shadow-sm bg-card">
                        <CardHeader>
                            <CardTitle>Tax Rates (%)</CardTitle>
                            <CardDescription>Manage sales tax for different items.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {taxRates.map(tr => (
                                <div key={tr.id} className="flex items-center justify-between gap-4 p-3 bg-muted/30 rounded-xl border border-border">
                                    <span className="text-sm font-bold text-foreground px-2">{tr.name}</span>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={tr.rate}
                                            onChange={(e) => updateTaxRate(tr.id, e.target.value)}
                                            className="w-24 text-right font-mono bg-background focus-visible:ring-primary h-9"
                                        />
                                        <span className="text-muted-foreground font-bold">%</span>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full border-dashed border-2 text-primary hover:text-primary hover:bg-primary/5 bg-transparent h-11 rounded-xl">
                                <Plus className="size-4 mr-2" />
                                Add Tax Category
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card className="border-border shadow-sm bg-card">
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Accepted ways to pay.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {paymentMethods.map(pm => (
                                <div
                                    key={pm.id}
                                    onClick={() => togglePaymentMethod(pm.id)}
                                    className={`cursor-pointer flex items-center justify-between p-3.5 rounded-xl border transition-all ${pm.active
                                            ? 'border-primary/50 bg-primary/5 shadow-sm shadow-primary/5'
                                            : 'border-border hover:bg-muted/50 hover:border-border/80'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm ${pm.active ? 'text-primary' : 'text-muted-foreground'}`}>{pm.icon}</span>
                                        <span className={`text-sm font-bold ${pm.active ? 'text-foreground' : 'text-muted-foreground'}`}>{pm.name}</span>
                                    </div>
                                    {pm.active ? (
                                        <CheckCircle2 className="size-5 text-primary" />
                                    ) : (
                                        <Circle className="size-5 text-muted-foreground" />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end pt-4 pb-8">
                    <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleDiscard}
                            className="w-full sm:w-auto px-6 h-12 rounded-xl border-border font-bold bg-background text-foreground"
                        >
                            <RotateCcw className="size-4 mr-2 text-muted-foreground" />
                            Discard Changes
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="w-full sm:w-auto px-8 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                        >
                            <Save className="size-4 mr-2" />
                            Save Configuration
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
