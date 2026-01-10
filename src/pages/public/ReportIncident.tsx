import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, Send } from "lucide-react";

export function ReportIncident() {
    return (
        <div className="container mx-auto py-12 px-4 animate-in fade-in duration-700">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Report an Incident</h1>
                    <p className="text-slate-500">Provide details about the disaster or emergency situation. Your report helps coordinate response.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Incident Details</CardTitle>
                        <CardDescription>All fields marked with * are required.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">Incident Type *</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select incident type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="flood">Flash Flood</SelectItem>
                                    <SelectItem value="landslide">Landslide</SelectItem>
                                    <SelectItem value="earthquake">Earthquake</SelectItem>
                                    <SelectItem value="snow">Heavy Snow / Avalanche</SelectItem>
                                    <SelectItem value="fire">Fire</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location / District *</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input id="location" placeholder="e.g., Hunza, Karimabad" className="pl-9" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the situation, estimated damage, and immediate needs..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input id="name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input id="contact" placeholder="0300-1234567" className="pl-9" />
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                            <Send className="mr-2 h-4 w-4" /> Submit Report
                        </Button>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-slate-500">
                    For immediate life-threatening emergencies, please call <strong>1122</strong> directly.
                </div>
            </div>
        </div>
    );
}
