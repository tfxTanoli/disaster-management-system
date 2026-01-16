import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Settings, Clock, CheckCircle, XCircle, Users,
    CreditCard, Loader2, Save, Eye, Ban, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PaymentSettings {
    id: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_title: string;
    easypaisa_number: string;
    jazzcash_number: string;
    monthly_price: number;
}

interface PaymentSubmission {
    id: string;
    user_id: string;
    user_email: string;
    user_name: string;
    amount: number;
    proof_url: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    created_at: string;
}

interface UserSubscription {
    id: string;
    email: string;
    name: string;
    subscription_status: string;
    subscription_expires_at: string | null;
    trial_ends_at: string | null;
}

export function AdminSubscriptions() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<PaymentSettings | null>(null);
    const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
    const [users, setUsers] = useState<UserSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch payment settings
            const { data: settingsData } = await supabase
                .from('payment_settings')
                .select('*')
                .single();

            if (settingsData) setSettings(settingsData);

            // Fetch all pending submissions
            const { data: subsData } = await supabase
                .from('payment_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (subsData) setSubmissions(subsData);

            // Fetch all users with subscription info
            const { data: usersData } = await supabase
                .from('users')
                .select('id, email, name, subscription_status, subscription_expires_at, trial_ends_at')
                .order('name', { ascending: true });

            if (usersData) setUsers(usersData);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('payment_settings')
                .update({
                    bank_name: settings.bank_name,
                    bank_account_number: settings.bank_account_number,
                    bank_account_title: settings.bank_account_title,
                    easypaisa_number: settings.easypaisa_number,
                    jazzcash_number: settings.jazzcash_number,
                    monthly_price: settings.monthly_price,
                    updated_at: new Date().toISOString()
                })
                .eq('id', settings.id);

            if (error) throw error;
            toast.success('Payment settings saved!');
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error('Failed to save settings', { description: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleApprove = async (submission: PaymentSubmission) => {
        try {
            // Update submission status
            await supabase
                .from('payment_submissions')
                .update({
                    status: 'approved',
                    admin_notes: adminNotes[submission.id] || 'Payment verified',
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', submission.id);

            // Update user subscription
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

            await supabase
                .from('users')
                .update({
                    subscription_status: 'active',
                    subscription_expires_at: expiresAt.toISOString()
                })
                .eq('id', submission.user_id);

            fetchData();
            toast.success('Payment approved!', { description: 'Subscription activated for 1 month' });
        } catch (error: any) {
            console.error('Approve error:', error);
            toast.error('Failed to approve', { description: error.message });
        }
    };

    const handleReject = async (submission: PaymentSubmission) => {
        const notes = adminNotes[submission.id] || 'Payment proof invalid or unclear';
        try {
            await supabase
                .from('payment_submissions')
                .update({
                    status: 'rejected',
                    admin_notes: notes,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', submission.id);

            fetchData();
            toast.success('Payment rejected');
        } catch (error: any) {
            console.error('Reject error:', error);
            toast.error('Failed to reject', { description: error.message });
        }
    };

    const toggleUserSubscription = async (userId: string, activate: boolean) => {
        try {
            const updates: any = { subscription_status: activate ? 'active' : 'expired' };
            if (activate) {
                const expiresAt = new Date();
                expiresAt.setMonth(expiresAt.getMonth() + 1);
                updates.subscription_expires_at = expiresAt.toISOString();
            }

            await supabase
                .from('users')
                .update(updates)
                .eq('id', userId);

            fetchData();
            toast.success(`Subscription ${activate ? 'activated' : 'deactivated'}`);
        } catch (error: any) {
            console.error('Toggle error:', error);
            toast.error('Failed to update', { description: error.message });
        }
    };

    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    const processedSubmissions = submissions.filter(s => s.status !== 'pending');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
                <p className="text-slate-500 mt-1">Manage payment settings, verify payments, and control user subscriptions.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pending ({pendingSubmissions.length})
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                {/* Pending Payments Tab */}
                <TabsContent value="pending" className="space-y-4">
                    {pendingSubmissions.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-700">All caught up!</h3>
                                <p className="text-slate-500">No pending payments to review.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        pendingSubmissions.map((sub) => (
                            <Card key={sub.id} className="border-2 border-yellow-200">
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* User Info & Proof */}
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{sub.user_name || 'Unknown User'}</h3>
                                                <p className="text-sm text-slate-500">{sub.user_email}</p>
                                                <p className="text-sm text-slate-400 mt-1">
                                                    Submitted: {new Date(sub.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4 text-slate-400" />
                                                <span className="font-semibold">PKR {sub.amount}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedProof(selectedProof === sub.proof_url ? null : sub.proof_url)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                {selectedProof === sub.proof_url ? 'Hide Proof' : 'View Proof'}
                                            </Button>
                                            {selectedProof === sub.proof_url && (
                                                <img
                                                    src={sub.proof_url}
                                                    alt="Payment proof"
                                                    className="w-full max-h-64 object-contain rounded border mt-2"
                                                />
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor={`notes-${sub.id}`}>Admin Notes (optional)</Label>
                                                <Textarea
                                                    id={`notes-${sub.id}`}
                                                    placeholder="Add notes for the user..."
                                                    value={adminNotes[sub.id] || ''}
                                                    onChange={(e) => setAdminNotes({ ...adminNotes, [sub.id]: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={() => handleApprove(sub)}
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleReject(sub)}
                                                    variant="destructive"
                                                    className="flex-1"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}

                    {/* Processed History */}
                    {processedSubmissions.length > 0 && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="text-lg">Recently Processed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {processedSubmissions.slice(0, 10).map((sub) => (
                                        <div key={sub.id} className={`p-3 rounded-lg flex items-center justify-between ${sub.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                                            }`}>
                                            <div>
                                                <span className="font-medium text-sm">{sub.user_name}</span>
                                                <span className="text-slate-400 mx-2">•</span>
                                                <span className="text-sm text-slate-500">{new Date(sub.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${sub.status === 'approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                                }`}>
                                                {sub.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>All Users</CardTitle>
                                <CardDescription>Manage user subscriptions manually</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchData}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2">User</th>
                                            <th className="text-left py-3 px-2">Status</th>
                                            <th className="text-left py-3 px-2">Expires</th>
                                            <th className="text-right py-3 px-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => {
                                            const isActive = u.subscription_status === 'active' &&
                                                u.subscription_expires_at &&
                                                new Date(u.subscription_expires_at) > new Date();
                                            const isTrial = u.trial_ends_at && new Date(u.trial_ends_at) > new Date();

                                            return (
                                                <tr key={u.id} className="border-b hover:bg-slate-50">
                                                    <td className="py-3 px-2">
                                                        <div>
                                                            <p className="font-medium">{u.name || 'No Name'}</p>
                                                            <p className="text-xs text-slate-500">{u.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${isActive ? 'bg-green-100 text-green-800' :
                                                            isTrial ? 'bg-blue-100 text-blue-800' :
                                                                'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {isActive ? 'ACTIVE' : isTrial ? 'TRIAL' : 'EXPIRED'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2 text-slate-500">
                                                        {isActive && u.subscription_expires_at
                                                            ? new Date(u.subscription_expires_at).toLocaleDateString()
                                                            : isTrial && u.trial_ends_at
                                                                ? new Date(u.trial_ends_at).toLocaleDateString()
                                                                : '-'
                                                        }
                                                    </td>
                                                    <td className="py-3 px-2 text-right">
                                                        {isActive ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 hover:bg-red-50"
                                                                onClick={() => toggleUserSubscription(u.id, false)}
                                                            >
                                                                <Ban className="h-3 w-3 mr-1" />
                                                                Deactivate
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700"
                                                                onClick={() => toggleUserSubscription(u.id, true)}
                                                            >
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Activate
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Account Settings</CardTitle>
                            <CardDescription>
                                Configure the bank and mobile wallet details shown to users on the payment page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {settings && (
                                <>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-slate-900">Bank Account</h4>
                                            <div>
                                                <Label htmlFor="bank_name">Bank Name</Label>
                                                <Input
                                                    id="bank_name"
                                                    value={settings.bank_name}
                                                    onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                                                    placeholder="e.g., HBL, UBL, Meezan"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="bank_account_number">Account Number</Label>
                                                <Input
                                                    id="bank_account_number"
                                                    value={settings.bank_account_number}
                                                    onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                                                    placeholder="Account number"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="bank_account_title">Account Title</Label>
                                                <Input
                                                    id="bank_account_title"
                                                    value={settings.bank_account_title}
                                                    onChange={(e) => setSettings({ ...settings, bank_account_title: e.target.value })}
                                                    placeholder="Account holder name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-slate-900">Mobile Wallets</h4>
                                            <div>
                                                <Label htmlFor="easypaisa_number">Easypaisa Number</Label>
                                                <Input
                                                    id="easypaisa_number"
                                                    value={settings.easypaisa_number}
                                                    onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                                                    placeholder="03XXXXXXXXX"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="jazzcash_number">JazzCash Number</Label>
                                                <Input
                                                    id="jazzcash_number"
                                                    value={settings.jazzcash_number}
                                                    onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                                                    placeholder="03XXXXXXXXX"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="monthly_price">Monthly Price (PKR)</Label>
                                                <Input
                                                    id="monthly_price"
                                                    type="number"
                                                    value={settings.monthly_price}
                                                    onChange={(e) => setSettings({ ...settings, monthly_price: parseFloat(e.target.value) })}
                                                    placeholder="1000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button onClick={saveSettings} disabled={saving} className="w-full md:w-auto">
                                            {saving ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Settings
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
