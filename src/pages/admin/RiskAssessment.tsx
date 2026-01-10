import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, CloudRain, Waves, ArrowRight, RefreshCcw } from "lucide-react";

export function RiskAssessment() {
    // State for inputs
    const [rainfall, setRainfall] = useState([45]);
    const [riverLevel, setRiverLevel] = useState([12.5]);
    const [soilMoisture, setSoilMoisture] = useState([60]);

    // State for result
    const [riskScore, setRiskScore] = useState<number | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Mock AI Prediction Logic
    const calculateRisk = () => {
        setIsAnalyzing(true);

        // Simulate API delay
        setTimeout(() => {
            // Logic: Higher inputs = Higher Risk
            // Normalized roughly to 0-100 scale
            const rScore = (rainfall[0] / 300) * 40; // Max 300mm
            const lScore = (riverLevel[0] / 30) * 40; // Max 30m
            const sScore = (soilMoisture[0] / 100) * 20; // Max 100%

            const total = Math.min(Math.round(rScore + lScore + sScore), 100);
            setRiskScore(total);
            setIsAnalyzing(false);
        }, 1500);
    };

    const resetForm = () => {
        setRainfall([0]);
        setRiverLevel([0]);
        setSoilMoisture([0]);
        setRiskScore(null);
    };

    const getRiskStatus = (score: number) => {
        if (score < 30) return { label: "SAFE", color: "text-green-600", bg: "bg-green-100", border: "border-green-500" };
        if (score < 70) return { label: "WARNING", color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-500" };
        return { label: "CRITICAL", color: "text-red-600", bg: "bg-red-100", border: "border-red-500" };
    };

    const status = riskScore !== null ? getRiskStatus(riskScore) : null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Risk Assessment Model</h1>
                    <p className="text-slate-500 mt-1">Simulate disaster scenarios using predictive analytics.</p>
                </div>
                <Button variant="outline" onClick={resetForm} disabled={isAnalyzing}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> Reset Model
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 h-full">
                {/* Input Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-lg border-0 border-t-4 border-t-blue-600">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CloudRain className="h-5 w-5 text-blue-600" /> Environmental Parameters
                            </CardTitle>
                            <CardDescription>Adjust the sliders to input real-time sensor data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 py-8">

                            {/* Rainfall Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold text-slate-700">Rainfall (mm/24h)</Label>
                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-blue-700">{rainfall} mm</span>
                                </div>
                                <Slider
                                    defaultValue={[45]}
                                    max={300}
                                    step={1}
                                    value={rainfall}
                                    onValueChange={setRainfall}
                                    className="py-2"
                                />
                                <p className="text-xs text-slate-400">Normal range: 0-50mm. Flood warning: {'&gt;'}100mm.</p>
                            </div>

                            {/* River Level Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold text-slate-700">River Level (meters)</Label>
                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-blue-700">{riverLevel} m</span>
                                </div>
                                <Slider
                                    defaultValue={[12.5]}
                                    max={30}
                                    step={0.1}
                                    value={riverLevel}
                                    onValueChange={setRiverLevel}
                                    className="py-2"
                                />
                                <p className="text-xs text-slate-400">Danger mark: {'&gt;'}20m for major rivers.</p>
                            </div>

                            {/* Soil Moisture Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold text-slate-700">Soil Moisture Saturation (%)</Label>
                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-blue-700">{soilMoisture}%</span>
                                </div>
                                <Slider
                                    defaultValue={[60]}
                                    max={100}
                                    step={1}
                                    value={soilMoisture}
                                    onValueChange={setSoilMoisture}
                                    className="py-2"
                                />
                                <p className="text-xs text-slate-400">High saturation increases landslide risk.</p>
                            </div>

                        </CardContent>
                    </Card>

                    <Button
                        className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 shadow-xl transition-all"
                        onClick={calculateRisk}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? "Processing AI Model..." : "Calculate Risk Probability"}
                        {!isAnalyzing && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                </div>

                {/* Output Panel */}
                <div className="lg:col-span-1">
                    <Card className={`h-full shadow-lg border-2 ${status ? status.border : 'border-slate-100'} transition-all duration-500`}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-slate-500" /> Prediction Result
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-10 pb-10 min-h-[400px]">

                            {riskScore === null ? (
                                <div className="text-center text-slate-400 space-y-4">
                                    <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-slate-300 animate-spin mx-auto mb-6 opacity-0"></div>
                                    <Waves className="h-24 w-24 mx-auto opacity-20 mb-4" />
                                    <p>Enter parameters and run the model to view prediction.</p>
                                </div>
                            ) : (
                                <div className="text-center w-full animate-in zoom-in duration-300">
                                    <div className={`w-40 h-40 rounded-full ${status?.bg} flex items-center justify-center mx-auto mb-6 relative border-4 ${status?.border}`}>
                                        <span className={`text-4xl font-black ${status?.color}`}>{riskScore}%</span>
                                        <div className="absolute -bottom-3 bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold border">RISK SCORE</div>
                                    </div>

                                    <h3 className={`text-3xl font-black mb-2 ${status?.color}`}>{status?.label}</h3>
                                    <p className="text-slate-500 mb-8 max-w-[200px] mx-auto">
                                        Based on current hydrological and geological data inputs.
                                    </p>

                                    <div className="space-y-3 text-left bg-slate-50 p-4 rounded-lg text-sm">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-slate-500">Confidence Score:</span>
                                            <span className="font-semibold text-slate-900">92.4%</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-slate-500">Model Version:</span>
                                            <span className="font-semibold text-slate-900">GB-v2.1</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Last Updated:</span>
                                            <span className="font-semibold text-slate-900">Just Now</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
