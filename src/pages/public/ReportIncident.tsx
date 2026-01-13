import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { database } from "@/lib/firebase";
import { ref, push, set, serverTimestamp } from "firebase/database";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ReportIncident() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        type: "",
        location: "",
        description: "",
        contact: "",
        name: user?.name || "",
        imageUrl: ""
    });

    const handleSubmit = async () => {
        if (!formData.type || !formData.location || !formData.description || !formData.contact) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const reportsRef = ref(database, 'reports');
            const newReportRef = push(reportsRef);

            await set(newReportRef, {
                ...formData,
                userId: user?.id || "anonymous",
                userEmail: user?.email || "anonymous",
                status: "pending", // verified, rejected
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString()
            });

            setSuccess(true);
            toast.success("Report submitted successfully! Our team will verify it shortly.");

            // Redirect after delay
            setTimeout(() => {
                navigate("/");
            }, 3000);

        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Failed to submit report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto py-24 px-4 text-center space-y-6 animate-in zoom-in-50 duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Report Submitted</h2>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                    Thank you for your vigilance. Your report has been sent to our Disaster Control Room for verification.
                </p>
                <Button onClick={() => navigate("/")} variant="outline">
                    Return to Home
                </Button>
            </div>
        );
    }

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
                            <Select onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select incident type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Flood">Flash Flood</SelectItem>
                                    <SelectItem value="Landslide">Landslide</SelectItem>
                                    <SelectItem value="Earthquake">Earthquake</SelectItem>
                                    <SelectItem value="Snow">Heavy Snow / Avalanche</SelectItem>
                                    <SelectItem value="Fire">Fire</SelectItem>
                                    <SelectItem value="RoadBlock">Road Blockage</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location / District *</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="location"
                                    placeholder="e.g., Hunza, Karimabad"
                                    className="pl-9"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the situation, estimated damage, and immediate needs..."
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image Evidence URL (Optional)</Label>
                            <Input
                                id="image"
                                placeholder="http://..."
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                            <p className="text-xs text-slate-400">Paste a direct link to an image if available.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="contact"
                                        placeholder="0300-1234567"
                                        className="pl-9"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit Report
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
