import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Clock, Activity, FileText, Radio } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';

// Fix for default marker icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Alert {
    id: string;
    title: string;
    severity: string;
    location?: string;
    created_at: string;
}

interface Report {
    id: string;
    title: string;
    incident_type: string;
    location: string;
    status: string;
    created_at: string;
}

// Gilgit-Baltistan region center
const GB_CENTER: [number, number] = [35.8, 74.5];

// Known incident locations (simulated from reports/alerts)
const KNOWN_LOCATIONS: Record<string, [number, number]> = {
    "Gilgit": [35.9208, 74.3144],
    "Skardu": [35.2824, 75.6212],
    "Hunza": [36.3167, 74.6500],
    "Nagar": [36.1000, 74.1000],
    "Ghanche": [35.2000, 76.4000],
    "Ghizer": [36.0500, 73.8200],
    "Astore": [35.3659, 74.8592],
    "Diamer": [35.5200, 73.7500],
    "Chilas": [35.4128, 74.0973],
    "Khaplu": [35.1500, 76.3300]
};

const SEVERITY_COLORS: Record<string, string> = {
    critical: "#dc2626",
    high: "#ea580c",
    medium: "#ca8a04",
    low: "#16a34a"
};

export function AdminLiveMap() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // Refresh every 30 seconds for "live" updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // Fetch active alerts
            const { data: alertsData } = await supabase
                .from('alerts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            // Fetch recent reports
            const { data: reportsData } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            setAlerts(alertsData || []);
            setReports(reportsData || []);
        } catch (error) {
            console.error('Error fetching live data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get coordinates for a location name
    const getCoordinates = (location: string | undefined, contextText: string = ""): [number, number] | null => {
        const searchText = (location + " " + contextText).toLowerCase();

        for (const [name, coords] of Object.entries(KNOWN_LOCATIONS)) {
            if (searchText.includes(name.toLowerCase())) {
                // Add slight randomization to avoid overlapping markers
                return [
                    coords[0] + (Math.random() - 0.5) * 0.1,
                    coords[1] + (Math.random() - 0.5) * 0.1
                ];
            }
        }
        return null; // Return null if no known location found in text
    };

    const activeAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
    const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'in_progress');

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Radio className="h-6 w-6 text-green-500 animate-pulse" />
                        Live Monitoring
                    </h1>
                    <p className="text-slate-400">Real-time disaster alerts and incident tracking</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="outline" className="border-red-500 text-red-400 px-3 py-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {activeAlerts.length} Active Alerts
                    </Badge>
                    <Badge variant="outline" className="border-amber-500 text-amber-400 px-3 py-1">
                        <FileText className="h-4 w-4 mr-1" />
                        {pendingReports.length} Pending Reports
                    </Badge>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Map - Takes 2 columns */}
                <Card className="lg:col-span-2 bg-slate-800 border-slate-700 overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-red-500" />
                            Gilgit-Baltistan Region
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[500px]">
                            <MapContainer
                                center={GB_CENTER}
                                zoom={7}
                                className="h-full w-full"
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Alert Markers */}
                                {alerts.map((alert, idx) => {
                                    const coords = getCoordinates(alert.location, alert.title);
                                    if (!coords) return null;
                                    return (
                                        <CircleMarker
                                            key={`alert-${idx}`}
                                            center={coords}
                                            radius={12}
                                            pathOptions={{
                                                fillColor: SEVERITY_COLORS[alert.severity] || "#888",
                                                fillOpacity: 0.8,
                                                color: 'white',
                                                weight: 2
                                            }}
                                        >
                                            <Popup>
                                                <div className="text-sm">
                                                    <strong className="text-red-600">{alert.title}</strong>
                                                    <br />
                                                    <span className="text-gray-500">Severity: {alert.severity}</span>
                                                    <br />
                                                    <span className="text-gray-500">{alert.location}</span>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    );
                                })}

                                {/* Report Markers */}
                                {reports.map((report, idx) => {
                                    const coords = getCoordinates(report.location);
                                    if (!coords) return null;
                                    return (
                                        <Marker
                                            key={`report-${idx}`}
                                            position={coords}
                                        >
                                            <Popup>
                                                <div className="text-sm">
                                                    <strong>{report.title}</strong>
                                                    <br />
                                                    <span className="text-gray-500">Type: {report.incident_type}</span>
                                                    <br />
                                                    <span className="text-gray-500">Status: {report.status}</span>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}

                                {/* Known Location Markers */}
                                {Object.entries(KNOWN_LOCATIONS).map(([name, coords]) => (
                                    <CircleMarker
                                        key={name}
                                        center={coords}
                                        radius={6}
                                        pathOptions={{
                                            fillColor: "#3b82f6",
                                            fillOpacity: 0.5,
                                            color: '#1d4ed8',
                                            weight: 1
                                        }}
                                    >
                                        <Popup>{name}</Popup>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar - Alerts & Activity */}
                <div className="space-y-4">
                    {/* Active Alerts */}
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Active Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 max-h-[250px] overflow-y-auto">
                            {loading ? (
                                <div className="text-slate-400 text-center py-4">Loading...</div>
                            ) : alerts.length === 0 ? (
                                <div className="text-slate-400 text-center py-4">No active alerts</div>
                            ) : (
                                alerts.slice(0, 5).map((alert) => (
                                    <div key={alert.id} className="p-3 bg-slate-900 rounded-lg border-l-4" style={{
                                        borderColor: SEVERITY_COLORS[alert.severity] || '#888'
                                    }}>
                                        <div className="font-medium text-white text-sm">{alert.title}</div>
                                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                            <MapPin className="h-3 w-3" />
                                            {alert.location || 'Unknown'}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(alert.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Reports */}
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-amber-500" />
                                Recent Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 max-h-[200px] overflow-y-auto">
                            {loading ? (
                                <div className="text-slate-400 text-center py-4">Loading...</div>
                            ) : reports.length === 0 ? (
                                <div className="text-slate-400 text-center py-4">No recent reports</div>
                            ) : (
                                reports.slice(0, 4).map((report) => (
                                    <div key={report.id} className="p-3 bg-slate-900 rounded-lg">
                                        <div className="font-medium text-white text-sm">{report.title}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {report.incident_type}
                                            </Badge>
                                            <span className={`text-xs ${report.status === 'pending' ? 'text-amber-400' :
                                                report.status === 'resolved' ? 'text-green-400' :
                                                    'text-slate-400'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Legend */}
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm">Map Legend</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <div className="h-3 w-3 rounded-full bg-red-600" />
                                Critical Alert
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <div className="h-3 w-3 rounded-full bg-orange-500" />
                                High Alert
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                Medium Alert
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                District Center
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
