"use client";

import { useState } from "react";
import { loginWithEmailPin } from "@/actions/auth";
import { useRouter } from "next/navigation";

import { Coffee, AlertCircle, Mail, KeyRound, LogIn, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await loginWithEmailPin(email, pin);

        if (result.success) {
            router.push("/");
            setTimeout(() => router.refresh(), 100);
        } else {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-sm relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 mb-5">
                        <Coffee className="size-8" />
                    </div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Kael Cafe</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Point of Sale</p>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-base font-bold">Masuk</h2>
                        <p className="text-xs text-muted-foreground mt-1">Gunakan email dan PIN untuk login</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-0 rounded-xl">
                                <AlertCircle className="size-4" />
                                <AlertDescription className="font-bold ml-2 text-sm">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="staff@kaelcafe.com"
                                    required
                                    className="pl-10 h-11 bg-muted/40 border-0 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="pin" className="text-xs text-muted-foreground">PIN</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="pin"
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="••••"
                                    required
                                    maxLength={8}
                                    className="pl-10 h-11 bg-muted/40 border-0 rounded-xl tracking-[0.3em] font-mono text-lg"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !email || !pin}
                            className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20 mt-2"
                        >
                            {isLoading ? (
                                <><Loader2 className="size-4 mr-2 animate-spin" />Memproses...</>
                            ) : (
                                <><LogIn className="size-4 mr-2" />Masuk</>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
                    &copy; {new Date().getFullYear()} Kael Cafe POS
                </p>
            </div>
        </div>
    );
}
