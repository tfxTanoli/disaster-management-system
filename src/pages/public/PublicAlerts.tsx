import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const publicAlerts = [
    { id: "ALT-001", type: "Flash Flood", severity: "Critical", location: "Gilgit Sector A - Riverside", time: "10 mins ago", desc: "Water levels rising rapidly due to heavy rainfall upstream. Evacuate low-lying areas immediately." },
    { id: "ALT-002", type: "Landslide", severity: "Warning", location: "Hunza Valley - KKH Mile 45", time: "45 mins ago", desc: "Active landslides reported near KKH. Road blocked at multiple points. Avoid travel." },
    { id: "ALT-003", type: "Heavy Snow", severity: "Watch", location: "Skardu District", time: "2 hours ago", desc: "Forecast predicts heavy snowfall over the next 24 hours. Prepare for potential road closures." },
];

export function PublicAlerts() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Alerts</h1>
                    <p className="text-slate-500">Real-time disaster warnings and advisories for Gilgit-Baltistan.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" /> Filter by District
                    </Button>
                    <Button variant="destructive" size="sm">
                        Subscribe to SMS
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {publicAlerts.map((alert) => (
                    <Card key={alert.id} className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'default'} className="uppercase">
                                            {alert.severity}
                                        </Badge>
                                        <span className="text-sm text-slate-500 flex items-center">
                                            <Clock className="mr-1 h-3 w-3" /> {alert.time}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl flex items-center">
                                        <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                                        {alert.type} Warning
                                    </CardTitle>
                                    <CardDescription className="flex items-center text-base font-medium text-slate-700">
                                        <MapPin className="mr-1 h-4 w-4" /> {alert.location}
                                    </CardDescription>
                                </div>
                                <Button variant="secondary">View Details</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600">
                                {alert.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
