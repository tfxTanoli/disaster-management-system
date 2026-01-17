import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface Alert {
    id: string;
    title: string;       // Changed from type
    message: string;     // Changed from description
    severity: string;    // Changed from specific union type to string to be safe, will normalize in render
    location?: string;   // Made optional as it might not exist
    created_at: string;
    active: boolean;
}

export function PublicAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();

        // Real-time subscription
        const subscription = supabase
            .channel('public:alerts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (payload) => {
                console.log('Real-time alert update:', payload);
                fetchAlerts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchAlerts = async () => {
        try {
            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .eq('active', true) // Only fetch active alerts
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setAlerts(data);
        } catch (error) {
            console.error("Error fetching alerts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to normalize severity for UI styles
    const getSeverityStyles = (severity: string) => {
        const normalized = severity.toLowerCase();
        if (normalized === 'critical') return { color: 'text-red-500', border: 'border-l-red-500', badge: 'destructive' as const };
        if (normalized === 'high' || normalized === 'warning') return { color: 'text-orange-500', border: 'border-l-orange-500', badge: 'destructive' as const }; // Reusing destructive for high visibility
        if (normalized === 'medium' || normalized === 'watch') return { color: 'text-yellow-500', border: 'border-l-yellow-500', badge: 'secondary' as const };
        return { color: 'text-blue-500', border: 'border-l-blue-500', badge: 'secondary' as const }; // low/advisory
    };

    return (
        <div className="container mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Alerts</h1>
                    <p className="text-slate-500">Real-time disaster warnings and advisories for Gilgit-Baltistan.</p>
                </div>
                <div className="flex gap-2">
                    {/* Buttons removed as requested */}
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                        No active alerts at this time.
                    </div>
                ) : (
                    alerts.map((alert) => {
                        const styles = getSeverityStyles(alert.severity);
                        return (
                            <Card key={alert.id} className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${styles.border}`}>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={styles.badge} className="uppercase">
                                                    {alert.severity}
                                                </Badge>
                                                <span className="text-sm text-slate-500 flex items-center">
                                                    <Clock className="mr-1 h-3 w-3" /> {format(new Date(alert.created_at), "PPpp")}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl flex items-center">
                                                <AlertTriangle className={`mr-2 h-5 w-5 ${styles.color}`} />
                                                {alert.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center text-base font-medium text-slate-700">
                                                <MapPin className="mr-1 h-4 w-4" /> {alert.location || "Gilgit-Baltistan Region"}
                                            </CardDescription>
                                        </div>
                                        <Button variant="secondary" onClick={() => setSelectedAlert(alert)}>View Details</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">
                                        {alert.message}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
            {/* Alert Details Dialog */}
            <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            {selectedAlert && (
                                <Badge variant={getSeverityStyles(selectedAlert.severity).badge} className="uppercase">
                                    {selectedAlert.severity}
                                </Badge>
                            )}
                            <span className="text-sm text-slate-500 flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {selectedAlert && format(new Date(selectedAlert.created_at), "PPpp")}
                            </span>
                        </div>
                        <DialogTitle className="flex items-center text-xl">
                            {selectedAlert && (
                                <>
                                    <AlertTriangle className={`mr-2 h-5 w-5 ${getSeverityStyles(selectedAlert.severity).color}`} />
                                    {selectedAlert.title}
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="flex items-center text-base font-medium text-slate-700 mt-2">
                            <MapPin className="mr-1 h-4 w-4" /> {selectedAlert?.location || "Gilgit-Baltistan Region"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border text-slate-700">
                        {selectedAlert?.message}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button variant="secondary" onClick={() => setSelectedAlert(null)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
