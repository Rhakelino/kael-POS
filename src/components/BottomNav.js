"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MonitorStop, ShoppingBag, Settings } from "lucide-react";

const tabs = [
    { name: "Kasir", path: "/cashier", icon: MonitorStop },
    { name: "Pesanan", path: "/orders", icon: ShoppingBag },
    { name: "Pengaturan", path: "/settings", icon: Settings },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border">
            <div className="flex items-stretch h-16 max-w-md mx-auto px-6">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
                        >
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
                            )}
                            <div className={`flex items-center justify-center rounded-xl transition-all ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
