"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext(null);

export function useSettings() {
    return useContext(SettingsContext);
}

export default function SettingsProvider({ children }) {
    // Basic Store Profile
    const [storeName, setStoreName] = useState("Kael Cafe");
    const [contactNumber, setContactNumber] = useState("+1 (555) 123-4567");
    const [address, setAddress] = useState("123 Espresso Way, Coffee City, CC 90210");

    // Receipt Printing
    const [autoPrint, setAutoPrint] = useState(false);
    const [receiptFooter, setReceiptFooter] = useState("Thank you for visiting! Follow us on Instagram @roastedbean_cafe");

    // Tax Rates
    const [taxRates, setTaxRates] = useState([
        { id: 1, name: "Standard Sales Tax", rate: 8.5 },
        { id: 2, name: "Prepared Food Tax", rate: 10.0 },
    ]);

    // Payment Methods
    const [paymentMethods, setPaymentMethods] = useState([
        { id: "cash", name: "Cash", icon: "payments", active: true },
        { id: "card", name: "Credit/Debit Card", icon: "credit_card", active: true },
        { id: "wallet", name: "Digital Wallets", icon: "account_balance_wallet", active: false },
    ]);

    // Theme (Light / Dark)
    const [theme, setTheme] = useState("light");

    // Load from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("pos_settings");
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                if (parsed.storeName) setStoreName(parsed.storeName);
                if (parsed.contactNumber) setContactNumber(parsed.contactNumber);
                if (parsed.address) setAddress(parsed.address);
                if (typeof parsed.autoPrint === "boolean") setAutoPrint(parsed.autoPrint);
                if (parsed.receiptFooter) setReceiptFooter(parsed.receiptFooter);
                if (parsed.taxRates) setTaxRates(parsed.taxRates);
                if (parsed.paymentMethods) setPaymentMethods(parsed.paymentMethods);
                if (parsed.theme) setTheme(parsed.theme);
            } catch (error) {
                console.error("Failed to load settings", error);
            }
        }
    }, []);

    // Apply theme changes to documentElement
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    // Save to localStorage when settings change
    const saveSettings = (newSettings) => {
        const currentSettings = {
            storeName,
            contactNumber,
            address,
            autoPrint,
            receiptFooter,
            taxRates,
            paymentMethods,
            theme,
        };
        const updated = { ...currentSettings, ...newSettings };

        setStoreName(updated.storeName);
        setContactNumber(updated.contactNumber);
        setAddress(updated.address);
        setAutoPrint(updated.autoPrint);
        setReceiptFooter(updated.receiptFooter);
        setTaxRates(updated.taxRates);
        setPaymentMethods(updated.paymentMethods);
        setTheme(updated.theme);

        localStorage.setItem("pos_settings", JSON.stringify(updated));
    };

    const value = {
        storeName,
        contactNumber,
        address,
        autoPrint,
        receiptFooter,
        taxRates,
        paymentMethods,
        theme,
        saveSettings
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
