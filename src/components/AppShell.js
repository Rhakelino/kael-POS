"use client";

import { usePathname } from "next/navigation";
import AuthProvider from "./AuthProvider";
import BottomNav from "./BottomNav";
import SettingsProvider from "./SettingsProvider";
import { Toaster } from "@/components/ui/sonner";

export default function AppShell({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const isCashier = pathname === "/cashier";

    if (isLoginPage) {
        return (
            <AuthProvider>
                <SettingsProvider>
                    {children}
                    <Toaster position="top-center" />
                </SettingsProvider>
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <SettingsProvider>
                <div className="flex flex-col h-[100dvh] overflow-hidden bg-background relative">
                    <div className="flex-1 overflow-y-auto pb-16">
                        {children}
                    </div>
                    <BottomNav />
                </div>
                <Toaster position="top-center" />
            </SettingsProvider>
        </AuthProvider>
    );
}
