import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "./AuthProvider";

export default function AppShell() {
    const location = useLocation();
    const isCashier = location.pathname === "/cashier";
    const { user, isLoading } = useAuth();

    if (isLoading) return null;
    if (!user) return null; // Let AuthProvider handle redirect

    return (
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-background relative">
            <div className="flex-1 overflow-y-auto pb-16">
                <Outlet />
            </div>
            <BottomNav />
            <Toaster position="top-center" />
        </div>
    );
}
