import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Loader2, Info } from 'lucide-react';
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
    const [result, setResult] = useState<{ score: number; status: string; description: string } | null>(null);

    const handleLocationSelect = (latlng: L.LatLng) => {
        setSelectedPos(latlng);
        setLoading(true);
        setResult(null);

        // Simulate API call to Geospatial Risk Engine
        setTimeout(() => {
            // Mock logic based on latitude (just for variation)
            const randomRisk = Math.floor(Math.random() * 80) + 10;
            let status = "Low Risk";
            let desc = "Geological stability is high. Normal weather patterns.";

            if (randomRisk > 70) {
                status = "Critical Risk";
                desc = "High landslide potential detected. Recent rainfall > 80mm.";
            } else if (randomRisk > 40) {
                status = "Moderate Risk";
                desc = "Soil moisture levels elevated. Monitor advisories.";
            }

            setResult({
                score: randomRisk,
                status: status,
                description: desc
            });
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Check Your Location Risk</h1>
                <p className="text-xl text-slate-600">
                    Interactive disaster risk assessment map. Click anywhere on the map to analyze local terrain, weather, and historical data for potential hazards.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
                {/* Map Section */}
                <Card className="lg:col-span-2 border-0 shadow-xl overflow-hidden h-full relative z-0">
                    <MapContainer
                        center={[35.9208, 74.3089]} // Coordinates for Gilgit
                        zoom={9}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker onLocationSelect={handleLocationSelect} />
                    </MapContainer>

                    {/* Overlay Instruction */}
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
                                    <p>Waiting for map input...</p>
                                </div>
                            )}

                            {loading && (
                                <div className="space-y-4">
                                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                                    <h3 className="text-xl font-semibold text-slate-700">Analyzing Terrain...</h3>
                                    <p className="text-slate-500 text-sm">Fetching satellite telemetry and topological data.</p>
                                </div>
                            )}

                            {result && !loading && (
                                <div className="w-full space-y-6 animate-in slide-in-from-bottom-5">
                                    <div className={`p-6 rounded-2xl ${result.score > 70 ? 'bg-red-50 text-red-900 border border-red-200' :
                                            result.score > 40 ? 'bg-orange-50 text-orange-900 border border-orange-200' :
                                                'bg-green-50 text-green-900 border border-green-200'
                                        }`}>
                                        <div className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Risk Level</div>
                                        <div className="text-4xl font-black mb-2">{result.status}</div>
                                        <div className="text-6xl font-black opacity-20">{result.score}%</div>
                                    </div>

                                    <div className="text-left space-y-2">
                                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" /> Hazard Assessment
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            {result.description}
                                        </p>
                                    </div>

                                    <Button className="w-full" variant="outline" onClick={() => {
                                        setSelectedPos(null);
                                        setResult(null);
                                    }}>
                                        Analyze Another Location
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
