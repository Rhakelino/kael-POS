"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/actions/auth";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setIsLoading(false);

            if (!currentUser && pathname !== "/login") {
                router.push("/login");
            }
            if (currentUser && pathname === "/login") {
                router.push("/");
            }
        }
        checkAuth();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-4">
                        <span className="material-symbols-outlined text-white text-3xl">coffee_maker</span>
                    </div>
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mt-4"></div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
