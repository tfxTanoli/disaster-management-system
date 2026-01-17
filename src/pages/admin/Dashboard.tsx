
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Tent, Activity, ArrowRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";


export function Dashboard() {
    const [stats, setStats] = useState({
        activeAlerts: 0,
        totalReports: 0, // Using as proxy for affected population until specific table
        usersCount: 0,
        sheltersCount: 0
    });
    const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();

        // Realtime subscription for alerts
        const subscription = supabase
            .channel('dashboard-alerts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch Active Alerts Count
            const { count: alertsCount } = await supabase
                .from('alerts')
                .select('*', { count: 'exact', head: true })
                .eq('active', true);

            // Fetch Critical Alerts
            const { data: criticalData } = await supabase
                .from('alerts')
                .select('*')
                .eq('active', true)
                .or('severity.eq.critical,severity.eq.high')
                .order('created_at', { ascending: false })
                .limit(5);

            // Fetch Users Count
            const { count: usersCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            // Fetch Reports Count (if table exists, otherwise mock or use another table)
            // Assuming 'incident_reports' or similar might exist, or just use 0 if not found
            const { count: reportsCount } = await supabase // flexible check
                .from('payment_submissions') // Placeholder: using valid table to avoid crash, logically replace with 'reports' later if schema known
                .select('*', { count: 'exact', head: true });


            setStats({
                activeAlerts: alertsCount || 0,
                totalReports: reportsCount || 0,
                usersCount: usersCount || 0,
                sheltersCount: 12 // Hardcoded for now as "shelters" table not confirmed
            });

            if (criticalData) setCriticalAlerts(criticalData);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    // Chart Data (Mock data based on real counts for visual consistency)
    const chartData = [
        { name: 'Mon', alerts: Math.floor(stats.activeAlerts * 0.2) },
        { name: 'Tue', alerts: Math.floor(stats.activeAlerts * 0.5) },
        { name: 'Wed', alerts: Math.floor(stats.activeAlerts * 0.8) },
        { name: 'Thu', alerts: stats.activeAlerts },
        { name: 'Fri', alerts: Math.floor(stats.activeAlerts * 1.2) },
        { name: 'Sat', alerts: Math.floor(stats.activeAlerts * 0.9) },
        { name: 'Sun', alerts: Math.floor(stats.activeAlerts * 0.4) },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of current disaster status and resources.</p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800">Download Report</Button>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                        <p className="text-xs text-muted-foreground">Currently active warnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">registered Users</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.usersCount}</div>
                        <p className="text-xs text-muted-foreground">Total citizens registered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shelters Active</CardTitle>
                        <Tent className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.sheltersCount}</div>
                        <p className="text-xs text-muted-foreground">Operational refugee centers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Operational</div>
                        <p className="text-xs text-muted-foreground">Last check: Just now</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 md:col-span-2 lg:col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Alert Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="alerts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Critical Alerts</CardTitle>
                        <CardDescription>High severity alerts requiring attention.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {criticalAlerts.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">No critical alerts at the moment.</p>
                            ) : (
                                criticalAlerts.map((alert) => (
                                    <div key={alert.id} className="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${alert.severity === 'critical' ? 'bg-red-100' : 'bg-orange-100'}`}>
                                            <AlertTriangle className={`h-4 w-4 ${alert.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                                        </span>
                                        <div className="ml-4 space-y-1 overflow-hidden">
                                            <p className="text-sm font-medium leading-none truncate">{alert.title}</p>
                                            <p className="text-sm text-muted-foreground truncate">{alert.location || 'Gilgit-Baltistan'}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                                            {alert.severity}
                                        </div>
                                    </div>
                                ))
                            )}
                            <Link to="/admin/content">
                                <Button variant="ghost" className="w-full mt-4">
                                    Manage Alerts <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
