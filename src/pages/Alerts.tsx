import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const alerts = [
    { id: "ALT-001", type: "Flash Flood", severity: "Critical", location: "Gilgit Sector A", time: "10 mins ago", status: "Active" },
    { id: "ALT-002", type: "Landslide", severity: "Warning", location: "Hunza Valley", time: "45 mins ago", status: "Active" },
    { id: "ALT-003", type: "Heavy Snow", severity: "Watch", location: "Skardu", time: "2 hours ago", status: "Monitoring" },
    { id: "ALT-004", type: "Earthquake", severity: "Advisory", location: "Chilas", time: "5 hours ago", status: "Resolved" },
    { id: "ALT-005", type: "Avalanche", severity: "Critical", location: "Astore", time: "1 day ago", status: "Resolved" },
];

export function Alerts() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
                    <p className="text-muted-foreground">Manage and monitor disaster alerts.</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" /> Create Alert
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of recent disaster alerts.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert.id}>
                                    <TableCell className="font-medium">{alert.id}</TableCell>
                                    <TableCell>{alert.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={alert.severity === 'Critical' ? 'destructive' : alert.severity === 'Warning' ? 'default' : 'secondary'}
                                            className={alert.severity === 'Warning' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                                        >
                                            {alert.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{alert.location}</TableCell>
                                    <TableCell>{alert.time}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span className={`h-2 w-2 rounded-full mr-2 ${alert.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                            {alert.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
