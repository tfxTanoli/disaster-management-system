import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        district: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Create Auth User
            // Supabase allows passing metadata in signUp which is cleaner
            const fullName = `${formData.firstName} ${formData.lastName}`;
            const role = "user"; // Default role is always user. Admin must promote manually.

            const { data: { user }, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                        district: formData.district // Passing district to metadata so Trigger can use it
                    }
                }
            });

            if (signUpError) throw signUpError;
            if (!user) throw new Error("Accout creation failed");

            // 4. Create User Entry in Public Table 'users'
            // We now handle this via a Supabase Database Trigger. 
            // However, we want to ensure the trial date is set correctly based on runtime.
            // We will attempt to update it here to be sure.

            const trialDetails = {
                trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Days Trial
                subscription_status: 'trial'
            };

            // Using a slight delay to allow trigger to create the row first if needed, 
            // though usually we can just upsert or update. 
            // Since we are client-side, we try to update.
            const { error: updateError } = await supabase
                .from('users')
                .update(trialDetails)
                .eq('id', user.id);

            if (updateError) {
                console.warn("Could not set trial date immediately (might be RLS or trigger delay):", updateError);
                // Non-blocking error, user is still created.
            }

            // 5. Show Success & Redirect
            setSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err: any) {
            console.error("Signup Error:", err);
            // Supabase returns message in 'message' or 'error_description'
            setError(err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Value Proposition */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535560293633-dc1e1c3134c8?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-slate-900/90 to-slate-900"></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                        <ShieldAlert className="h-6 w-6 text-red-500" />
                        <span className="font-bold text-xl tracking-tight">GB-DMS</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg space-y-8">
                    <h1 className="text-4xl font-extrabold leading-tight">Join the Community Resiliency Network.</h1>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                            <div>
                                <h3 className="font-bold">Real-time SMS Alerts</h3>
                                <p className="text-slate-400 text-sm">Get instant notifications about hazards in your specific district.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                            <div>
                                <h3 className="font-bold">Report Incidents Faster</h3>
                                <p className="text-slate-400 text-sm">Save your profile details for one-tap emergency reporting.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                            <div>
                                <h3 className="font-bold">Access Offline Guides</h3>
                                <p className="text-slate-400 text-sm">Download survival manuals directly to your device.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    © 2026 Gilgit-Baltistan Disaster Management Authority
                </div>
            </div>

            {/* Right: Signup Form */}
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
                            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                            <CardDescription>
                                Enter your details to register for the DMS portal
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {success ? (
                                <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-300">
                                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900">Account Created!</h3>
                                        <p className="text-slate-500">Welcome to the network. Redirecting to dashboard...</p>
                                    </div>
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400 mt-4" />
                                </div>
                            ) : (
                                <form onSubmit={handleSignup} className="grid gap-4">
                                    {error && (
                                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="first-name">First name</Label>
                                            <Input
                                                id="first-name"
                                                placeholder="John"
                                                required
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="last-name">Last name</Label>
                                            <Input
                                                id="last-name"
                                                placeholder="Doe"
                                                required
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="district">District</Label>
                                        <Input
                                            id="district"
                                            placeholder="e.g. Gilgit, Skardu, Hunza"
                                            value={formData.district}
                                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-2" disabled={loading}>
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create Account"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 border-t pt-6 text-center text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                                Sign in
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
