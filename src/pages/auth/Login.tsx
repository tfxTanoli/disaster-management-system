import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate("/"); // Redirect to home, AuthContext will update state
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding & Info */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580132144365-1d44ee49303e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                        <ShieldAlert className="h-6 w-6 text-red-500" />
                        <span className="font-bold text-xl tracking-tight">GB-DMS</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <h1 className="text-5xl font-extrabold leading-tight">Welcome back to the Control Center.</h1>
                    <p className="text-lg text-slate-400">
                        Secure access for authorized personnel and registered users. Monitor alerts, manage resources, and coordinate response efforts effectively.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    © 2026 Gilgit-Baltistan Disaster Management Authority
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link to="/" className="flex items-center space-x-2">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                            <span className="font-bold text-2xl text-slate-900">GB-DMS</span>
                        </Link>
                    </div>

                    <Card className="shadow-2xl border-0">
                        <CardHeader className="space-y-1">
                            <Link to="/" className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                            </Link>
                            <CardTitle className="text-2xl font-bold tracking-tight">Sign in to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to access your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="grid gap-4">
                                {error && (
                                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
                                        {error}
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link to="#" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-2" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Sign In"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 border-t pt-6 text-center text-sm text-slate-600">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                                Sign up for public alerts
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
