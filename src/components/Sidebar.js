"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useSettings } from "./SettingsProvider";
import { logout } from "@/actions/auth";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { storeName } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change on mobile
    useEffect(() => {
        // eslint-disable-next-line
        setIsOpen(false);
    }, [pathname]);

    const navItems = [
        { name: "Dashboard", path: "/", icon: "dashboard" },
        { name: "Orders", path: "/orders", icon: "shopping_bag" },
        { name: "Menu", path: "/menu", icon: "restaurant_menu" },
        { name: "Cashier", path: "/cashier", icon: "point_of_sale" },
        { name: "Settings", path: "/settings", icon: "settings" },
    ];

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-zinc-950 shadow-sm border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:bg-zinc-900 transition-colors"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex-shrink-0 flex flex-col bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 h-full`}>
                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">coffee_maker</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">{storeName}</h1>
                            <p className="text-slate-500 dark:text-zinc-400 text-xs mt-1">POS Terminal</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:text-zinc-400">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:bg-zinc-800"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'active-icon' : ''}`}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile + Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                    {user && (
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined text-xl">person</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">{user.role}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
