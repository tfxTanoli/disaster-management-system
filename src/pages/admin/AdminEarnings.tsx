import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, DollarSign, TrendingUp, CreditCard, Calendar } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { format } from "date-fns";

interface PaymentSubmission {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    user_name: string;
    user_email: string;
}

export function AdminEarnings() {
    const [payments, setPayments] = useState<PaymentSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const { data, error } = await supabase
                .from('payment_submissions')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data) {
                setPayments(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error("Error fetching earnings:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: PaymentSubmission[]) => {
        // Total Earnings
        const total = data.reduce((acc, curr) => acc + curr.amount, 0);
        setTotalEarnings(total);

        // Monthly Earnings (Current Month)
        const now = new Date();
        const currentMonthTotal = data
            .filter(p => {
                const date = new Date(p.created_at);
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            })
            .reduce((acc, curr) => acc + curr.amount, 0);
        setMonthlyEarnings(currentMonthTotal);

        // Chart Data (Last 30 Days)
        // Group by day
        const dailyData: Record<string, number> = {};

        data.forEach(payment => {
            const dateStr = format(new Date(payment.created_at), 'MMM dd');
            dailyData[dateStr] = (dailyData[dateStr] || 0) + payment.amount;
        });

        const chart = Object.keys(dailyData).map(date => ({
            name: date,
            amount: dailyData[date]
        }));

        // If we have very little data, ensure chart looks okay by adding some context or just using what we have
        // For now, simple mapping
        setChartData(chart);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Earnings Overview</h1>
                <p className="text-slate-500 mt-1">Track revenue from Pro Plan subscriptions.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Lifetime Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">PKR {totalEarnings.toLocaleString()}</div>
                        <p className="text-xs text-slate-400 mt-1">
                            From {payments.length} successful transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">PKR {monthlyEarnings.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Current billing cycle
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Average Transaction</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            PKR {payments.length > 0 ? Math.round(totalEarnings / payments.length).toLocaleString() : 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Per verified user
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                        <CardDescription>Income flow over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `PKR ${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            itemStyle={{ color: '#0f172a' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorAmount)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">
                                    No data available for chart
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions List */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Verified Payments</CardTitle>
                        <CardDescription>Latest pro plan activations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {payments.slice(-5).reverse().map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{payment.user_name}</p>
                                            <p className="text-xs text-slate-500">{format(new Date(payment.created_at), 'MMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-700">PKR {payment.amount}</span>
                                </div>
                            ))}
                            {payments.length === 0 && (
                                <p className="text-center text-slate-400 py-4">No payments found</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
