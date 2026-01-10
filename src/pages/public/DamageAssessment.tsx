import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, Home, Tractor, CheckCircle2 } from "lucide-react";

export function DamageAssessment() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-xl border-t-4 border-t-green-600">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Report Submitted</CardTitle>
                    <CardDescription className="text-lg">
                        Your damage assessment report has been securely recorded. Our teams will review the data for verification.
                    </CardDescription>
                    <div className="mt-8">
                        <Button onClick={() => setSubmitted(false)} variant="outline">
                            Submit Another Report
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 font-sans">
            <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-red-500 to-green-500"></div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Damage Assessment Protocol</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Rapidly report disaster impact parameters. Accurate data is critical for mobilizing the correct relief resources.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-8">

                        {/* Section 1: Location & Reporter - BLUE THEME */}
                        <Card className="shadow-lg border-0 bg-blue-50 overflow-hidden">
                            <CardHeader className="pb-6 border-b border-blue-100">
                                <CardTitle className="flex items-center gap-3 text-2xl text-blue-900">
                                    <div className="p-2 bg-blue-200 rounded-lg shadow-sm">
                                        <ClipboardList className="h-6 w-6 text-blue-800" />
                                    </div>
                                    Incident Context
                                </CardTitle>
                                <CardDescription className="text-blue-700 font-medium">Location parameters and reporting officer details.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-8 p-8">
                                <div className="space-y-3">
                                    <Label htmlFor="district" className="text-base font-bold text-blue-900">District</Label>
                                    <Select required>
                                        <SelectTrigger className="h-12 text-lg bg-white border-blue-200 text-blue-900 focus:ring-blue-500">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gilgit">Gilgit</SelectItem>
                                            <SelectItem value="skardu">Skardu</SelectItem>
                                            <SelectItem value="diamer">Diamer</SelectItem>
                                            <SelectItem value="hunza">Hunza</SelectItem>
                                            <SelectItem value="ghizer">Ghizer</SelectItem>
                                            <SelectItem value="astore">Astore</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="tehsil" className="text-base font-bold text-blue-900">Tehsil / Village</Label>
                                    <Input id="tehsil" placeholder="e.g. Danyore" required className="h-12 text-lg bg-white border-blue-200 text-blue-900 focus:ring-blue-500 placeholder:text-blue-300" />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="date" className="text-base font-bold text-blue-900">Date of Incident</Label>
                                    <Input id="date" type="date" required className="h-12 text-lg bg-white border-blue-200 text-blue-900 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="reporter" className="text-base font-bold text-blue-900">Reporter Name / ID</Label>
                                    <Input id="reporter" placeholder="Full Name" required className="h-12 text-lg bg-white border-blue-200 text-blue-900 focus:ring-blue-500 placeholder:text-blue-300" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 2: Human Impact - RED THEME */}
                        <Card className="shadow-lg border-0 bg-red-50 overflow-hidden">
                            <CardHeader className="pb-6 border-b border-red-100">
                                <CardTitle className="flex items-center gap-3 text-2xl text-red-900">
                                    <div className="p-2 bg-red-200 rounded-lg shadow-sm">
                                        <Users className="h-6 w-6 text-red-800" />
                                    </div>
                                    Human Impact Assessment
                                </CardTitle>
                                <CardDescription className="text-red-700 font-medium">Critical casualty data. Please verify before submission.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-8 p-8">
                                <div className="space-y-3 p-4 bg-white/60 rounded-xl border border-red-100 shadow-sm">
                                    <Label htmlFor="deaths" className="text-red-900 font-extrabold uppercase tracking-wide">Deaths (Confirmed)</Label>
                                    <div className="relative">
                                        <Input id="deaths" type="number" min="0" placeholder="0" className="pl-4 text-3xl font-bold h-16 bg-white border-red-200 text-red-600 focus:ring-red-500" />
                                    </div>
                                </div>
                                <div className="space-y-3 p-4 bg-white/60 rounded-xl border border-red-100 shadow-sm">
                                    <Label htmlFor="injured" className="text-orange-900 font-extrabold uppercase tracking-wide">Injured (Severe)</Label>
                                    <Input id="injured" type="number" min="0" placeholder="0" className="pl-4 text-3xl font-bold h-16 bg-white border-orange-200 text-orange-600 focus:ring-orange-500" />
                                </div>
                                <div className="space-y-3 p-4 bg-white/60 rounded-xl border border-red-100 shadow-sm">
                                    <Label htmlFor="missing" className="text-slate-900 font-extrabold uppercase tracking-wide">Missing Persons</Label>
                                    <Input id="missing" type="number" min="0" placeholder="0" className="pl-4 text-3xl font-bold h-16 bg-white border-slate-200 text-slate-700 focus:ring-slate-500" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 3: Infrastructure - ORANGE THEME */}
                        <Card className="shadow-lg border-0 bg-orange-50 overflow-hidden">
                            <CardHeader className="pb-6 border-b border-orange-100">
                                <CardTitle className="flex items-center gap-3 text-2xl text-orange-900">
                                    <div className="p-2 bg-orange-200 rounded-lg shadow-sm">
                                        <Home className="h-6 w-6 text-orange-800" />
                                    </div>
                                    Infrastructure Analysis
                                </CardTitle>
                                <CardDescription className="text-orange-800 font-medium">Housing and public infrastructure stability report.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-8 p-8">
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-orange-900">Houses Destroyed (Fully)</Label>
                                    <Input type="number" min="0" placeholder="0" className="h-12 bg-white border-orange-200 text-orange-900 focus:ring-orange-500" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-orange-900">Houses Damaged (Partially)</Label>
                                    <Input type="number" min="0" placeholder="0" className="h-12 bg-white border-orange-200 text-orange-900 focus:ring-orange-500" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-orange-900">Public Buildings</Label>
                                    <Input type="number" min="0" placeholder="0" className="h-12 bg-white border-orange-200 text-orange-900 focus:ring-orange-500" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-orange-900">Roads/Bridges Status</Label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-white border-orange-200 text-orange-900 focus:ring-orange-500">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ok">Functional</SelectItem>
                                            <SelectItem value="blocked">Blocked</SelectItem>
                                            <SelectItem value="destroyed">Washed Away</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 4: Agriculture/Livestock - GREEN THEME */}
                        <Card className="shadow-lg border-0 bg-green-50 overflow-hidden">
                            <CardHeader className="pb-6 border-b border-green-100">
                                <CardTitle className="flex items-center gap-3 text-2xl text-green-900">
                                    <div className="p-2 bg-green-200 rounded-lg shadow-sm">
                                        <Tractor className="h-6 w-6 text-green-800" />
                                    </div>
                                    Livelihood & Agriculture
                                </CardTitle>
                                <CardDescription className="text-green-800 font-medium">Agricultural impact and livestock losses.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-8 p-8">
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-green-900">Crop Area Affected (Acres)</Label>
                                    <Input type="number" min="0" placeholder="0" className="h-12 bg-white border-green-200 text-green-900 focus:ring-green-500" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-green-900">Livestock Lost (Heads)</Label>
                                    <Input type="number" min="0" placeholder="0" className="h-12 bg-white border-green-200 text-green-900 focus:ring-green-500" />
                                </div>
                                <div className="col-span-2 space-y-3">
                                    <Label className="text-base font-bold text-green-900">Additional Remarks</Label>
                                    <Textarea placeholder="Describe immediate needs, specific location details, or other observations..." className="h-32 text-lg resize-none bg-white border-green-200 text-green-900 focus:ring-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end pt-8 pb-12">
                            <Button type="submit" size="lg" className="w-full md:w-auto text-lg h-16 px-12 bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                Submit Final Assessment
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
