"use client";

import { useState } from "react";
import { loginWithEmailPin } from "@/actions/auth";
import { useRouter } from "next/navigation";

import { Coffee, AlertCircle, Mail, KeyRound, LogIn, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
            // Minimal delay to allow cookie to register
            setTimeout(() => {
                router.refresh();
            }, 100);
        } else {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 mb-6 group hover:scale-105 transition-transform">
                        <Coffee className="size-10 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Kael Cafe</h1>
                    <p className="text-muted-foreground mt-2 text-sm font-medium">Point of Sale Terminal</p>
                </div>

                {/* Login Card */}
                <Card className="w-full border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-xl">Welcome Back</CardTitle>
                        <CardDescription>Login with email and PIN to continue</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5">
                            {error && (
                                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-0">
                                    <AlertCircle className="size-4" />
                                    <AlertDescription className="font-bold ml-2">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="staff@kaelcafe.com"
                                        required
                                        className="pl-9 h-12 bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pin">PIN</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="pin"
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="••••"
                                        required
                                        maxLength={8}
                                        className="pl-9 h-12 bg-background tracking-[0.3em] font-mono text-lg"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2 pb-6 px-6">
                            <Button
                                type="submit"
                                disabled={isLoading || !email || !pin}
                                className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="size-5 mr-2 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="size-5 mr-2" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
                    &copy; {new Date().getFullYear()} Kael Cafe POS &mdash; All rights reserved
                </p>
            </div>
        </div>
    );
}
