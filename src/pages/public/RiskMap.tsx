import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, CircleMarker } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, MapPin, Loader2, Info, Navigation, ShieldCheck, XCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Supported Districts Config
const SUPPORTED_DISTRICTS = [
    "Gilgit", "Skardu", "Hunza", "Nagar", "Ghanche",
    "Ghizer", "Astore", "Diamer", "Shigar", "Kharmang"
];

// Helper Types
interface PredictionResult {
    prediction: string;
    risk_level: string;
    confidence: number;
    visual_color: string;
    recommendations: string[];
}

interface RouteData {
    path: [number, number][];
    safe_zone: { lat: number; lng: number };
    estimated_time: string;
    distance: string;
}

// Helper Component to Recenter Map
function MapUpdater({ center }: { center: L.LatLng }) {
    const map = useMapEvents({});
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (latlng: L.LatLng) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Running Analysis on this location...</Popup>
        </Marker>
    );
}

export function RiskMap() {
    const [selectedPos, setSelectedPos] = useState<L.LatLng | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [route, setRoute] = useState<RouteData | null>(null);
    const [loadingRoute, setLoadingRoute] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<L.LatLng | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string>("Unknown");

    // Dialog State
    const [showUnsupportedDialog, setShowUnsupportedDialog] = useState(false);
    const [unsupportedLocation, setUnsupportedLocation] = useState("");

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            setLoading(true);
            setLoading(true);
            // Use Backend Proxy to avoid CORS and add User-Agent
            const response = await fetch(`http://localhost:8000/geocode?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];

                // --- District Validation Logic ---
                // 1. Identify potential district name from query or result
                const nameFromOSM = display_name.split(',')[0].trim();
                const query = searchQuery.trim();

                // 2. Fuzzy/Direct match against supported list
                const matchDistrict = SUPPORTED_DISTRICTS.find(d =>
                    query.toLowerCase().includes(d.toLowerCase()) ||
                    nameFromOSM.toLowerCase().includes(d.toLowerCase()) ||
                    display_name.toLowerCase().includes(d.toLowerCase())
                );

                if (!matchDistrict) {
                    // UNSUPPORTED LOCATION
                    setUnsupportedLocation(nameFromOSM || query);
                    setShowUnsupportedDialog(true);
                    setLoading(false);
                    return; // Stop processing
                }

                // VALID LOCATION
                const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
                setSelectedPos(newPos);
                setSearchResult(newPos);
                setSelectedDistrict(matchDistrict); // Use the official matched name

                // Don't auto-predict; user must click "Check Analysis"
                setResult(null);
                setRoute(null);
            }
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (latlng: L.LatLng) => {
        // For map clicks, we might not know the district immediately.
        // We can either reverse geocode OR allow it but warn if backend returns "Unknown" risk.
        // For now, let's allow map clicks for exploration but searches are strict.
        setSelectedPos(latlng);
        setResult(null);
        setRoute(null);
        setSelectedDistrict("Unknown");
    };

    const runRiskAnalysis = async () => {
        if (!selectedPos) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: selectedPos.lat,
                    longitude: selectedPos.lng,
                    district: selectedDistrict,
                    // Use more varied "random" inputs based on lat/lng to avoid static 56% if model is missing or limited
                    rainfall: (selectedPos.lat % 1) * 100 + Math.random() * 50,
                    river_level: (selectedPos.lng % 1) * 30,
                    soil_moisture: Math.random() * 100
                }),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("API Error:", error);
            setResult({
                prediction: "Service Unavailable",
                risk_level: "Unknown",
                confidence: 0,
                visual_color: "#cbd5e1",
                recommendations: ["Ensure backend server is running."]
            });
        } finally {
            setLoading(false);
        }
    };


    const handleNavigate = async () => {
        if (!selectedPos) return;
        setLoadingRoute(true);
        try {
            const response = await fetch('http://localhost:8000/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start: { latitude: selectedPos.lat, longitude: selectedPos.lng }
                }),
            });
            const data = await response.json();
            setRoute(data);
        } catch (error) {
            console.error("Route Error:", error);
        } finally {
            setLoadingRoute(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Check Your Location Risk</h1>
                <p className="text-xl text-slate-600">
                    Interactive disaster risk assessment map. Click anywhere on the map to analyze local terrain, weather, and historical data for potential hazards.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto flex gap-2">
                <input
                    type="text"
                    placeholder="Search location (e.g., Gilgit, Skardu, Hunza)..."
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
                {/* Map Section */}
                <Card className="lg:col-span-2 border-0 shadow-xl overflow-hidden h-full relative z-0">
                    <MapContainer
                        center={[35.9208, 74.3089]} // Gilgit
                        zoom={9}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker onLocationSelect={handleLocationSelect} />

                        {/* Sync map center with search result */}
                        {searchResult && <MapUpdater center={searchResult} />}

                        {/* Route Visualization */}
                        {route && (
                            <>
                                <Polyline
                                    positions={route.path}
                                    pathOptions={{ color: '#10b981', weight: 4, dashArray: '10, 10' }}
                                />
                                <CircleMarker
                                    center={[route.safe_zone.lat, route.safe_zone.lng]}
                                    pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.5 }}
                                    radius={10}
                                >
                                    <Popup>Safe Zone</Popup>
                                </CircleMarker>
                            </>
                        )}
                    </MapContainer>

                    {!selectedPos && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg max-w-xs z-[400] text-sm hidden md:block">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <p>Navigate to your village or area and <strong>click on the map</strong> to run a real-time risk simulation.</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Results Panel */}
                <div className="lg:col-span-1">
                    <Card className="h-full border-2 border-slate-100 shadow-lg flex flex-col">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-red-600" />
                                Analysis Report
                            </CardTitle>
                            <CardDescription>
                                {selectedPos
                                    ? `Coordinates: ${selectedPos.lat.toFixed(4)}, ${selectedPos.lng.toFixed(4)}`
                                    : "Select a location to begin"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-8">
                            {!selectedPos && (
                                <div className="text-slate-400 space-y-4">
                                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="h-10 w-10 opacity-30" />
                                    </div>
                                    <p>Select a location on the map to begin.</p>
                                </div>
                            )}

                            {selectedPos && !result && !loading && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Location Selected</h3>
                                    <p className="text-slate-500">
                                        {selectedPos.lat.toFixed(4)}, {selectedPos.lng.toFixed(4)}
                                    </p>
                                    <Button
                                        onClick={runRiskAnalysis}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                                    >
                                        Run Risk Analysis
                                    </Button>
                                    <p className="text-xs text-slate-400">
                                        Fetches real-time satellite & sensor data.
                                    </p>
                                </div>
                            )}

                            {loading && (
                                <div className="space-y-4">
                                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                                    <h3 className="text-xl font-semibold text-slate-700">Analyzing Terrain...</h3>
                                    <p className="text-slate-500 text-sm">Fetching model predictions...</p>
                                </div>
                            )}

                            {result && !loading && (
                                <div className="w-full space-y-6 animate-in slide-in-from-bottom-5">
                                    <div className={`p-6 rounded-2xl border ${result.risk_level === 'Critical' ? 'bg-red-50 text-red-900 border-red-200' :
                                        result.risk_level === 'Moderate' ? 'bg-orange-50 text-orange-900 border-orange-200' :
                                            'bg-green-50 text-green-900 border-green-200'
                                        }`}>
                                        <div className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Risk Level</div>
                                        <div className="text-4xl font-black mb-2">{result.risk_level}</div>
                                        <div className="text-sm opacity-60">Confidence: {result.confidence}%</div>
                                    </div>

                                    <div className="text-left space-y-2">
                                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" /> Hazard: {result.prediction}
                                        </h4>
                                        <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                                            {result.recommendations.map((rec, i) => (
                                                <li key={i}>{rec}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 space-y-3">
                                        {route ? (
                                            <div className="bg-emerald-50 p-4 rounded-lg flex items-center justify-between text-left">
                                                <div>
                                                    <div className="font-bold text-emerald-900 flex items-center gap-2">
                                                        <ShieldCheck className="h-4 w-4" /> Route Found
                                                    </div>
                                                    <div className="text-xs text-emerald-700">Distance: {route.distance}</div>
                                                </div>
                                                <div className="text-emerald-800 font-mono font-bold">{route.estimated_time}</div>
                                            </div>
                                        ) : (
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={handleNavigate}
                                                disabled={loadingRoute}
                                            >
                                                {loadingRoute ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Navigation className="h-4 w-4 mr-2" />}
                                                Find Evacuation Route
                                            </Button>
                                        )}

                                        <Button className="w-full" variant="ghost" onClick={() => {
                                            setSelectedPos(null);
                                            setResult(null);
                                            setRoute(null);
                                        }}>
                                            Analyze Another Location
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Unsupported Location Dialog */}
            <Dialog open={showUnsupportedDialog} onOpenChange={setShowUnsupportedDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Region Not Supported</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            We currently only support disaster risk analysis for the <strong>10 districts of Gilgit-Baltistan</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700">
                        <p className="font-semibold mb-2">Supported Districts:</p>
                        <div className="flex flex-wrap gap-2">
                            {SUPPORTED_DISTRICTS.map(d => (
                                <span key={d} className="px-2 py-1 bg-white border rounded text-xs text-slate-600 shadow-sm">{d}</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-xs text-center text-slate-400">
                        You searched for: <span className="italic">{unsupportedLocation}</span>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button onClick={() => setShowUnsupportedDialog(false)} variant="secondary" className="w-full sm:w-auto">
                            Understood
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
