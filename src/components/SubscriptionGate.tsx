import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Crown, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionGateProps {
    children: React.ReactNode;
    featureName?: string;
}

/**
 * SubscriptionGate - Blocks access to premium features if trial expired and no active subscription
 * Wraps premium content and shows upgrade prompt when needed
 */
export function SubscriptionGate({ children, featureName = 'this feature' }: SubscriptionGateProps) {
    const { isAuthenticated, isTrialActive, hasActiveSubscription, isAdmin, loading } = useAuth();

    // Still loading auth state
    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent" />
            </div>
        );
    }

    // Not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
                <div className="max-w-md text-center">
                    <Lock className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
                    <p className="text-slate-400 mb-8">
                        Please sign in to access {featureName}.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/login">
                            <Button className="bg-red-600 hover:bg-red-700">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Admin always has access
    if (isAdmin) {
        return <>{children}</>;
    }

    // Has active subscription or trial
    if (hasActiveSubscription || isTrialActive) {
        return <>{children}</>;
    }

    // Trial expired, no subscription - show upgrade prompt
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-lg text-center">
                <div className="relative inline-block mb-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center mx-auto">
                        <Crown className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                    Upgrade to Pro
                </h2>

                <p className="text-slate-400 mb-6 text-lg">
                    Your free trial has ended. Subscribe to continue using {featureName} and unlock all premium features.
                </p>

                <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
                    <h3 className="text-xl font-semibold text-amber-400 mb-4">Pro Shield Benefits</h3>
                    <ul className="text-left space-y-3 text-slate-300">
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            AI-Powered Disaster Predictions
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            Interactive Risk Maps & Safe Zones
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            Evacuation Route Navigation
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            Priority Customer Support
                        </li>
                    </ul>
                </div>

                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">PKR 1,000</span>
                    <span className="text-slate-400 ml-2">/month</span>
                </div>

                <Link to="/payment">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-8">
                        Upgrade Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>

                <p className="text-slate-500 text-sm mt-6">
                    Secure manual payment via Bank Transfer, Easypaisa, or JazzCash
                </p>
            </div>
        </div>
    );
}
