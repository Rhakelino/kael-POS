"use client";

import { usePathname } from "next/navigation";
import AuthProvider from "./AuthProvider";
import Sidebar from "./Sidebar";
import SettingsProvider from "./SettingsProvider";

export default function AppShell({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <AuthProvider>
            <SettingsProvider>
                {isLoginPage ? (
                    children
                ) : (
                    <div className="flex h-screen overflow-hidden">
                        <Sidebar />
                        {children}
                    </div>
                )}
            </SettingsProvider>
        </AuthProvider>
    );
}
