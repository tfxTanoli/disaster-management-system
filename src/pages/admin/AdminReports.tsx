import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, MapPin, Phone, User, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Report {
    id: string;
    type: string;
    location: string;
    description: string;
    contact: string;
    name: string;
    status: "pending" | "verified" | "rejected";
    createdAt: string;
    imageUrl?: string;
}

export function AdminReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reportsRef = ref(database, 'reports');
        const unsubscribe = onValue(reportsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedReports = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    ...value
                }));
                // Sort by new
                setReports(loadedReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                setReports([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: "verified" | "rejected") => {
        try {
            await update(ref(database, `reports/${id}`), { status: newStatus });
            toast.success(`Report marked as ${newStatus}`);
        } catch (error) {
            console.error("Error updating report:", error);
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this report?")) return;
        try {
            await remove(ref(database, `reports/${id}`));
            toast.success("Report deleted");
        } catch (error) {
            console.error("Error deleting report:", error);
            toast.error("Failed to delete report");
        }
    };

    const ReportCard = ({ report }: { report: Report }) => (
        <Card key={report.id} className="mb-4 overflow-hidden border-l-4" style={{
            borderLeftColor: report.status === 'verified' ? '#10b981' : report.status === 'rejected' ? '#ef4444' : '#f59e0b'
        }}>
            <CardHeader className="bg-slate-50 pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant={report.type === 'Other' ? 'secondary' : 'destructive'} className="uppercase">
                                {report.type}
                            </Badge>
                            <Badge variant="outline" className={`capitalize ${report.status === 'verified' ? 'text-green-600 border-green-200 bg-green-50' :
                                report.status === 'rejected' ? 'text-red-600 border-red-200 bg-red-50' :
                                    'text-orange-600 border-orange-200 bg-orange-50'
                                }`}>
                                {report.status}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            {report.location}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3" />
                            {format(new Date(report.createdAt), 'PPpp')}
                        </CardDescription>
                    </div>
                    {report.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleUpdateStatus(report.id, 'rejected')}>
                                Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(report.id, 'verified')}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Verify
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100 italic">
                    "{report.description}"
                </p>

                {report.imageUrl && (
                    <div className="relative h-48 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={report.imageUrl} alt="Incident Evidence" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Attached Evidence
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {report.name}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {report.contact}</span>
                    </div>
                    {report.status !== 'pending' && (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(report.id)}>
                            Delete
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

    const pendingReports = reports.filter(r => r.status === 'pending');
    const verifiedReports = reports.filter(r => r.status === 'verified');
    const rejectedReports = reports.filter(r => r.status === 'rejected');

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Incident Reports</h1>
                    <p className="text-slate-500">Verify and manage citizen-reported incidents.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {pendingReports.length} Pending
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {pendingReports.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No pending reports to review.</p>
                        </div>
                    ) : pendingReports.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </TabsContent>

                <TabsContent value="verified" className="space-y-4">
                    {verifiedReports.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p>No verified reports yet.</p>
                        </div>
                    ) : verifiedReports.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                    {rejectedReports.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p>No rejected reports.</p>
                        </div>
                    ) : rejectedReports.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
