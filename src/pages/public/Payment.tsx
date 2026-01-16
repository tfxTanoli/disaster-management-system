import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    CreditCard, Upload, Clock, CheckCircle, XCircle,
    Smartphone, Building2, Loader2, AlertTriangle, Shield,
    Copy, Check, Ban
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface PaymentSettings {
    bank_name: string;
    bank_account_number: string;
    bank_account_title: string;
    easypaisa_number: string;
    jazzcash_number: string;
    monthly_price: number;
}

interface PaymentSubmission {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    admin_notes?: string;
}

interface UserSubscription {
    trial_ends_at: string | null;
    subscription_status: string;
    subscription_expires_at: string | null;
}

export function Payment() {
    const { user, isAuthenticated } = useAuth();
    const [settings, setSettings] = useState<PaymentSettings | null>(null);
    const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
    const [userSub, setUserSub] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // Fetch payment settings
            const { data: settingsData } = await supabase
                .from('payment_settings')
                .select('*')
                .single();

            if (settingsData) setSettings(settingsData);

            // Fetch user's payment submissions
            const { data: subsData } = await supabase
                .from('payment_submissions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (subsData) setSubmissions(subsData);

            // Fetch user subscription info
            const { data: userData } = await supabase
                .from('users')
                .select('trial_ends_at, subscription_status, subscription_expires_at')
                .eq('id', user.id)
                .single();

            if (userData) setUserSub(userData);

        } catch (error) {
            console.error('Error fetching payment data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = async () => {
        if (!file || !user || !settings) return;

        setUploading(true);
        try {
            // Upload proof image to Supabase Storage
            const fileName = `${user.id}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('payment-proofs')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('payment-proofs')
                .getPublicUrl(fileName);

            // Create payment submission record
            const { error: insertError } = await supabase
                .from('payment_submissions')
                .insert({
                    user_id: user.id,
                    user_email: user.email,
                    user_name: user.name,
                    amount: settings.monthly_price,
                    proof_url: urlData.publicUrl,
                    status: 'pending'
                });

            if (insertError) throw insertError;

            // Refresh data
            setFile(null);
            setPreviewUrl(null);
            fetchData();
            toast.success('Payment proof submitted successfully!', {
                description: 'We will review it within 24 hours.'
            });

        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Failed to submit payment proof', {
                description: error.message
            });
        } finally {
            setUploading(false);
        }
    };

    const handleUnsubscribe = async () => {
        if (!user) return;
        if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) return;

        setCancelling(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    subscription_status: 'cancelled',
                    subscription_expires_at: null
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success('Subscription cancelled', {
                description: 'You can resubscribe anytime.'
            });
            fetchData();
        } catch (error: any) {
            toast.error('Failed to cancel subscription', {
                description: error.message
            });
        } finally {
            setCancelling(false);
        }
    };

    const getSubscriptionStatus = () => {
        if (!userSub) return { status: 'unknown', message: 'Loading...', color: 'slate' };

        const now = new Date();
        const trialEnd = userSub.trial_ends_at ? new Date(userSub.trial_ends_at) : null;
        const subEnd = userSub.subscription_expires_at ? new Date(userSub.subscription_expires_at) : null;

        if (userSub.subscription_status === 'active' && subEnd && subEnd > now) {
            return {
                status: 'active',
                message: `Active until ${subEnd.toLocaleDateString()}`,
                color: 'green'
            };
        }

        if (trialEnd && trialEnd > now) {
            const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return {
                status: 'trial',
                message: `Free trial: ${daysLeft} days remaining`,
                color: 'blue'
            };
        }

        return {
            status: 'expired',
            message: 'Trial expired - Payment required',
            color: 'red'
        };
    };

    const getPendingSubmission = () => {
        return submissions.find(s => s.status === 'pending');
    };

    const subStatus = getSubscriptionStatus();
    const pendingSubmission = getPendingSubmission();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <Shield className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Login Required</h1>
                    <p className="text-slate-600 mb-8">Please login to manage your subscription.</p>
                    <Link to="/login">
                        <Button size="lg">Login to Continue</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Manage Subscription</h1>
                    <p className="text-lg text-slate-600">
                        Unlock premium disaster prediction and safety features.
                    </p>
                </div>

                {/* Current Status Banner */}
                <Card className={`mb-8 border-2 ${subStatus.color === 'green' ? 'border-green-200 bg-green-50' :
                    subStatus.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                        'border-red-200 bg-red-50'
                    }`}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {subStatus.color === 'green' ? (
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            ) : subStatus.color === 'blue' ? (
                                <Clock className="h-8 w-8 text-blue-600" />
                            ) : (
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            )}
                            <div>
                                <h3 className={`font-bold text-lg ${subStatus.color === 'green' ? 'text-green-900' :
                                    subStatus.color === 'blue' ? 'text-blue-900' :
                                        'text-red-900'
                                    }`}>
                                    {subStatus.status === 'active' ? 'Subscription Active' :
                                        subStatus.status === 'trial' ? 'Free Trial' : 'Action Required'}
                                </h3>
                                <p className={`text-sm ${subStatus.color === 'green' ? 'text-green-700' :
                                    subStatus.color === 'blue' ? 'text-blue-700' :
                                        'text-red-700'
                                    }`}>
                                    {subStatus.message}
                                </p>
                            </div>
                        </div>
                        {subStatus.status === 'active' && (
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full">PRO</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                    onClick={handleUnsubscribe}
                                    disabled={cancelling}
                                >
                                    {cancelling ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Ban className="h-4 w-4 mr-1" />
                                            Unsubscribe
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Submission Notice */}
                {pendingSubmission && (
                    <Card className="mb-8 border-2 border-yellow-300 bg-yellow-50">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Clock className="h-6 w-6 text-yellow-600 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-yellow-900">Payment Under Review</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Your payment proof submitted on {new Date(pendingSubmission.created_at).toLocaleDateString()} is being reviewed.
                                        You will be notified within 24 hours.
                                    </p>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Verification in progress...</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment Methods */}
                {subStatus.status !== 'active' && !pendingSubmission && settings && (
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Payment Details Card */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                    Payment Details
                                </CardTitle>
                                <CardDescription>
                                    Send PKR {settings.monthly_price}/month to any of these accounts
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Bank Account */}
                                <div className="p-4 bg-slate-50 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Building2 className="h-5 w-5 text-slate-600" />
                                        <span className="font-semibold text-slate-900">Bank Transfer</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Bank:</span>
                                            <span className="font-medium">{settings.bank_name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Account #:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-medium">{settings.bank_account_number}</span>
                                                <button
                                                    onClick={() => copyToClipboard(settings.bank_account_number, 'bank')}
                                                    className="p-1 hover:bg-slate-200 rounded"
                                                >
                                                    {copiedField === 'bank' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-slate-400" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Title:</span>
                                            <span className="font-medium">{settings.bank_account_title}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Wallets */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Smartphone className="h-4 w-4 text-green-600" />
                                            <span className="font-semibold text-green-900 text-sm">Easypaisa</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm">{settings.easypaisa_number}</span>
                                            <button
                                                onClick={() => copyToClipboard(settings.easypaisa_number, 'easypaisa')}
                                                className="p-1 hover:bg-green-100 rounded"
                                            >
                                                {copiedField === 'easypaisa' ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-green-400" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Smartphone className="h-4 w-4 text-red-600" />
                                            <span className="font-semibold text-red-900 text-sm">JazzCash</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm">{settings.jazzcash_number}</span>
                                            <button
                                                onClick={() => copyToClipboard(settings.jazzcash_number, 'jazzcash')}
                                                className="p-1 hover:bg-red-100 rounded"
                                            >
                                                {copiedField === 'jazzcash' ? <Check className="h-3 w-3 text-red-600" /> : <Copy className="h-3 w-3 text-red-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upload Proof Card */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-blue-600" />
                                    Upload Payment Proof
                                </CardTitle>
                                <CardDescription>
                                    After sending payment, upload your receipt screenshot
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="proof">Payment Screenshot</Label>
                                        <div className="mt-2">
                                            <Input
                                                id="proof"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {previewUrl && (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Payment proof preview"
                                                className="w-full h-48 object-cover rounded-lg border"
                                            />
                                            <button
                                                onClick={() => { setFile(null); setPreviewUrl(null); }}
                                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!file || uploading}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Submit for Verification
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-slate-500 text-center">
                                        Your payment will be verified within 24 hours
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Submission History */}
                {submissions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {submissions.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className={`p-4 rounded-lg border flex items-center justify-between ${sub.status === 'approved' ? 'bg-green-50 border-green-200' :
                                            sub.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                                'bg-yellow-50 border-yellow-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {sub.status === 'approved' ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : sub.status === 'rejected' ? (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-yellow-600" />
                                            )}
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {new Date(sub.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </p>
                                                {sub.admin_notes && (
                                                    <p className="text-xs text-slate-500">{sub.admin_notes}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${sub.status === 'approved' ? 'bg-green-600 text-white' :
                                            sub.status === 'rejected' ? 'bg-red-600 text-white' :
                                                'bg-yellow-500 text-white'
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
