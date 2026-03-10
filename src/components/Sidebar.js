"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useSettings } from "./SettingsProvider";
import { logout } from "@/actions/auth";
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    MonitorStop,
    Settings,
    LogOut,
    Coffee,
    Menu,
    User,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Menu", path: "/menu", icon: UtensilsCrossed },
    { name: "Cashier", path: "/cashier", icon: MonitorStop },
    { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { storeName } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    // Default to not collapsed on first render, then sync with localStorage
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const savedCollapsed = localStorage.getItem("sidebarCollapsed");
        if (savedCollapsed === "true") {
            setIsCollapsed(true);
        }
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebarCollapsed", newState);
            return newState;
        });
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        router.refresh();
    };

    // Responsive Sidebar Content
    const SidebarContent = ({ isDesktop = false }) => {
        const collapsed = isDesktop ? isCollapsed : false;

        return (
            <div className="flex h-full flex-col bg-card relative">
                <div className={`flex h-16 items-center border-b border-border ${collapsed ? "justify-center px-0" : "px-6 gap-3"}`}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <Coffee className="size-5" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-base font-bold leading-tight truncate">{storeName || "Kaelcafe"}</span>
                            <span className="text-xs text-muted-foreground font-medium truncate">POS Dashboard</span>
                        </div>
                    )}
                </div>

                {isDesktop && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute -right-4 top-5 z-50 rounded-full shadow-sm bg-background size-8 hidden lg:flex"
                        onClick={toggleCollapse}
                    >
                        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                    </Button>
                )}

                <nav className={`flex-1 space-y-1.5 py-4 overflow-y-auto ${collapsed ? "px-3" : "px-4"}`}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                title={collapsed ? item.name : undefined}
                                className={`flex items-center rounded-xl py-2.5 transition-all ${collapsed ? "justify-center px-0" : "gap-3 px-3"
                                    } ${isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`size-5 shrink-0 ${isActive ? "text-primary-foreground" : ""}`} />
                                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={`border-t border-border p-4 ${collapsed ? "flex flex-col items-center px-2" : ""}`}>
                    {user && (
                        <div className={`mb-4 flex items-center ${collapsed ? "justify-center" : "gap-3 px-2"}`}>
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="size-5" />
                            </div>
                            {!collapsed && (
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate text-sm font-bold">{user.name}</span>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {user.role}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <Button
                        variant="outline"
                        size={collapsed ? "icon" : "default"}
                        className={`w-full justify-start bg-muted/50 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 ${collapsed ? "justify-center p-0" : "gap-2"
                            }`}
                        onClick={handleLogout}
                        title={collapsed ? "Logout" : undefined}
                    >
                        <LogOut className="size-4" />
                        {!collapsed && <span>Logout</span>}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Mobile Sidebar */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger
                    className={buttonVariants({ variant: "outline", size: "icon", className: "fixed left-4 top-4 z-40 lg:hidden shadow-sm" })}
                >
                    <Menu className="size-5" />
                    <span className="sr-only">Toggle Menu</span>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0 border-r-0">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SidebarContent isDesktop={false} />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out ${isCollapsed ? "w-[80px]" : "w-[280px]"
                    }`}
            >
                <SidebarContent isDesktop={true} />
            </aside>
        </>
    );
}
