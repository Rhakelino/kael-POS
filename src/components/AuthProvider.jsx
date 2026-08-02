import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                
                if (data.user) {
                    setUser(data.user);
                    if (location.pathname === "/login") {
                        navigate("/cashier", { replace: true });
                    }
                } else {
                    setUser(null);
                    if (location.pathname !== "/login") {
                        navigate("/login", { replace: true });
                    }
                }
            } catch (err) {
                setUser(null);
                if (location.pathname !== "/login") navigate("/login", { replace: true });
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, [location.pathname, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-4">
                        <Coffee className="size-8 text-primary-foreground" />
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
