import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { MapPin, Phone, Building2, BedDouble, Search, Navigation } from "lucide-react";

type FacilityProps = {
    id: number;
    name: string;
    type: "Hospital" | "Shelter" | "Warehouse" | "Control Room";
    district: string;
    address: string;
    phone: string;
    capacity?: string;
    status: "Active" | "Full" | "Inactive";
};

const facilitiesData: FacilityProps[] = [
    { id: 1, name: "DHQ Hospital Gilgit", type: "Hospital", district: "Gilgit", address: "Hospital Road, Gilgit City", phone: "05811-920253", status: "Active" },
    { id: 2, name: "Aga Khan Medical Center", type: "Hospital", district: "Gilgit", address: "Sonikot, Gilgit", phone: "05811-455083", status: "Active" },
    { id: 3, name: "Skardu Central Shelter", type: "Shelter", district: "Skardu", address: "Near Old Airport", capacity: "500 People", phone: "05815-920100", status: "Active" },
    { id: 4, name: "Chilas Emergency Warehouse", type: "Warehouse", district: "Diamer", address: "KKH, Chilas", phone: "05812-920050", status: "Active" },
    { id: 5, name: "Hunza Relief Camp", type: "Shelter", district: "Hunza", address: "Aliabad, Hunza", capacity: "200 People", phone: "05813-920110", status: "Full" },
    { id: 6, name: "Ghaneche DHQ", type: "Hospital", district: "Ghanche", address: "Khaplu", phone: "05816-920120", status: "Active" },
    { id: 7, name: "DDMA Control Room", type: "Control Room", district: "Astore", address: "DC Office Complex", phone: "05817-920130", status: "Active" },
];

export function Facilities() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const filteredFacilities = facilitiesData.filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            facility.district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeTab === "All" || facility.type === activeTab;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl space-y-8 animate-in fade-in duration-700">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900">Emergency Facilities Directory</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg pt-2">
                        Locate authorized hospitals, relief shelters, and emergency control rooms across Gilgit-Baltistan.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                            className="pl-10 h-12 text-lg"
                            placeholder="Search by name or district..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 md:w-auto p-1 h-12">
                            <TabsTrigger value="All" className="px-4">All</TabsTrigger>
                            <TabsTrigger value="Hospital">Hospitals</TabsTrigger>
                            <TabsTrigger value="Shelter">Shelters</TabsTrigger>
                            <TabsTrigger value="Control Room">Control Rooms</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Facilities Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFacilities.map((item) => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-slate-900">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant={item.type === "Hospital" ? "default" : "secondary"} className="mb-2">
                                        {item.type}
                                    </Badge>
                                    <Badge variant="outline" className={item.status === "Active" ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"}>
                                        {item.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl">{item.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" /> {item.address}, {item.district}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <span className="font-mono font-semibold">{item.phone}</span>
                                </div>
                                {item.capacity && (
                                    <div className="flex items-center gap-3 text-slate-600 px-3">
                                        <BedDouble className="h-5 w-5 text-slate-400" />
                                        <span>Capacity: {item.capacity}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-white text-slate-900 border hover:bg-slate-50">
                                    <Navigation className="mr-2 h-4 w-4" /> Get Directions
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {filteredFacilities.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            <Building2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p className="text-xl">No facilities found matching your criteria.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
