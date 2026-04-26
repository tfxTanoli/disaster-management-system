import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    CloudRain, ArrowRight, RefreshCcw, Loader2,
    Thermometer, Mountain, Activity, XCircle,
    ChevronDown, ChevronUp, AlertTriangle, Droplets,
} from "lucide-react";

const DISTRICTS = [
    "Gilgit", "Skardu", "Hunza", "Nagar", "Ghanche",
    "Ghizer", "Astore", "Diamer", "Shigar", "Kharmang",
];

const DISTRICT_COORDS: Record<string, [number, number]> = {
    Gilgit:   [35.9208, 74.3089],
    Skardu:   [35.2971, 75.6368],
    Hunza:    [36.3165, 74.6500],
    Nagar:    [36.2167, 74.5167],
    Ghanche:  [35.4900, 76.5600],
    Ghizer:   [36.1728, 73.7508],
    Astore:   [35.3522, 74.8574],
    Diamer:   [35.5000, 74.6000],
    Shigar:   [35.4190, 75.9870],
    Kharmang: [34.9390, 76.2230],
};

const TERRAIN_OPTIONS = ["Unknown", "Valley", "Hilly", "Mountainous"];

const SCENARIOS = [
    {
        label: "Flood",
        emoji: "🌊",
        ring: "ring-blue-500",
        bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",
        activeBg: "bg-blue-600 border-blue-600 text-white",
        values: { rainfall: 200, riverLevel: 15, terrain: "Valley", tempElevated: false, seismic: false },
    },
    {
        label: "Landslide",
        emoji: "⛰️",
        ring: "ring-amber-500",
        bg: "bg-amber-50 hover:bg-amber-100 border-amber-200",
        activeBg: "bg-amber-500 border-amber-500 text-white",
        values: { rainfall: 60, riverLevel: 0, terrain: "Mountainous", tempElevated: false, seismic: false },
    },
    {
        label: "GLOF",
        emoji: "🧊",
        ring: "ring-cyan-500",
        bg: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
        activeBg: "bg-cyan-600 border-cyan-600 text-white",
        values: { rainfall: 0, riverLevel: 0, terrain: "Unknown", tempElevated: true, seismic: false },
    },
    {
        label: "Earthquake",
        emoji: "🌍",
        ring: "ring-red-500",
        bg: "bg-red-50 hover:bg-red-100 border-red-200",
        activeBg: "bg-red-600 border-red-600 text-white",
        values: { rainfall: 0, riverLevel: 0, terrain: "Unknown", tempElevated: false, seismic: true },
    },
];

const BAR_COLOR: Record<string, string> = {
    Flood: "#3b82f6", Landslide: "#f59e0b", GLOF: "#06b6d4", Earthquake: "#ef4444",
};

function riskStyle(level: string) {
    if (level === "Critical") return {
        label: "Critical Risk", text: "text-red-700", bg: "bg-red-50",
        border: "border-red-400", pill: "bg-red-600", num: "bg-red-600",
    };
    if (level === "Moderate") return {
        label: "Moderate Risk", text: "text-orange-700", bg: "bg-orange-50",
        border: "border-orange-400", pill: "bg-orange-500", num: "bg-orange-500",
    };
    return {
        label: "Low Risk", text: "text-green-700", bg: "bg-green-50",
        border: "border-green-400", pill: "bg-green-600", num: "bg-green-600",
    };
}

export function RiskAssessment() {
    const [district, setDistrict]         = useState("Gilgit");
    const [rainfall, setRainfall]         = useState([0]);
    const [riverLevel, setRiverLevel]     = useState([0]);
    const [terrain, setTerrain]           = useState("Unknown");
    const [tempElevated, setTempElevated] = useState(false);
    const [seismic, setSeismic]           = useState(false);
    const [activeScenario, setActiveScenario] = useState<string | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [result, setResult] = useState<{
        prediction: string; risk_level: string; confidence: number;
        recommendations: string[]; class_probabilities?: Record<string, number>;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const hasSignal = rainfall[0] > 20 || riverLevel[0] > 1 ||
        terrain !== "Unknown" || tempElevated || seismic;

    const pickScenario = (s: typeof SCENARIOS[0]) => {
        setActiveScenario(s.label);
        setRainfall([s.values.rainfall]);
        setRiverLevel([s.values.riverLevel]);
        setTerrain(s.values.terrain);
        setTempElevated(s.values.tempElevated);
        setSeismic(s.values.seismic);
        setResult(null);
        setError(null);
    };

    const analyze = async () => {
        if (!hasSignal) return;
        setLoading(true);
        setResult(null);
        setError(null);
        const [lat, lng] = DISTRICT_COORDS[district] ?? [35.9208, 74.3089];
        try {
            const res = await fetch("http://localhost:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    latitude: lat, longitude: lng, district,
                    rainfall: rainfall[0], river_level: riverLevel[0],
                    soil_moisture: 0, temperature_elevated: tempElevated,
                    terrain, seismic_activity: seismic,
                }),
            });
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e.detail || `Server error ${res.status}`);
            }
            setResult(await res.json());
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(
                msg.toLowerCase().includes("fetch")
                    ? "Cannot connect to the prediction server.\nRun: python backend/fast_server.py"
                    : msg
            );
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setDistrict("Gilgit"); setRainfall([0]); setRiverLevel([0]);
        setTerrain("Unknown"); setTempElevated(false); setSeismic(false);
        setActiveScenario(null); setResult(null); setError(null);
    };

    const s = result ? riskStyle(result.risk_level) : null;
    const sortedProbs = result?.class_probabilities
        ? Object.entries(result.class_probabilities).sort(([, a], [, b]) => b - a)
        : [];

    return (
        <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Risk Assessment</h1>
                    <p className="text-sm text-slate-500">AI-powered disaster prediction for Gilgit-Baltistan</p>
                </div>
                <button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <RefreshCcw className="h-3.5 w-3.5" /> Reset
                </button>
            </div>

            {/* Main card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">

                {/* Step 1 — District */}
                <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Step 1 — Select a district
                    </p>
                    <Select value={district} onValueChange={(v) => { setDistrict(v); setResult(null); }}>
                        <SelectTrigger className="w-full text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DISTRICTS.map((d) => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Step 2 — Scenario */}
                <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Step 2 — Choose a disaster scenario
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                        {SCENARIOS.map((sc) => {
                            const active = activeScenario === sc.label;
                            return (
                                <button
                                    key={sc.label}
                                    onClick={() => pickScenario(sc)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold
                                                text-sm transition-all hover:scale-[1.01] active:scale-[0.99]
                                                ${active ? sc.activeBg : `${sc.bg} text-slate-700`}`}
                                >
                                    <span className="text-xl leading-none">{sc.emoji}</span>
                                    {sc.label}
                                    {active && <span className="ml-auto text-xs opacity-80">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Fine-tune (optional, collapsible) */}
                <div className="px-5 py-3">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors w-full"
                    >
                        {showAdvanced
                            ? <ChevronUp className="h-4 w-4" />
                            : <ChevronDown className="h-4 w-4" />}
                        Fine-tune values
                        <span className="ml-auto text-xs text-slate-400">optional</span>
                    </button>

                    {showAdvanced && (
                        <div className="mt-4 space-y-5 pb-2">

                            {/* Rainfall */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                        <CloudRain className="h-4 w-4 text-blue-400" /> Rainfall
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                        rainfall[0] > 100 ? "bg-red-100 text-red-600"    :
                                        rainfall[0] > 50  ? "bg-orange-100 text-orange-600" :
                                        rainfall[0] > 20  ? "bg-yellow-100 text-yellow-600" :
                                        "bg-slate-100 text-slate-500"
                                    }`}>{rainfall[0]} mm/day</span>
                                </div>
                                <Slider max={300} step={5} value={rainfall}
                                    onValueChange={(v) => { setRainfall(v); setActiveScenario(null); }} />
                            </div>

                            {/* River Level */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                        <Droplets className="h-4 w-4 text-blue-400" /> River Level
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                        riverLevel[0] > 20 ? "bg-red-100 text-red-600"    :
                                        riverLevel[0] > 10 ? "bg-orange-100 text-orange-600" :
                                        riverLevel[0] > 1  ? "bg-yellow-100 text-yellow-600" :
                                        "bg-slate-100 text-slate-500"
                                    }`}>{riverLevel[0]} m above normal</span>
                                </div>
                                <Slider max={30} step={0.5} value={riverLevel}
                                    onValueChange={(v) => { setRiverLevel(v); setActiveScenario(null); }} />
                            </div>

                            {/* Terrain */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                    <Mountain className="h-4 w-4 text-amber-500" /> Terrain
                                </span>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {TERRAIN_OPTIONS.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => { setTerrain(t); setActiveScenario(null); }}
                                            className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                                                terrain === t
                                                    ? "bg-amber-500 text-white border-amber-500"
                                                    : "bg-white text-slate-500 border-slate-200 hover:border-amber-300"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => { setTempElevated(!tempElevated); setActiveScenario(null); }}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm
                                                font-medium transition-all ${
                                        tempElevated
                                            ? "bg-orange-50 border-orange-400 text-orange-800"
                                            : "bg-white border-slate-200 text-slate-500 hover:border-orange-200"
                                    }`}
                                >
                                    <Thermometer className={`h-4 w-4 ${tempElevated ? "text-orange-500" : "text-slate-300"}`} />
                                    High Temp
                                    <span className={`ml-auto text-xs font-bold ${tempElevated ? "text-orange-500" : "text-slate-300"}`}>
                                        {tempElevated ? "ON" : "OFF"}
                                    </span>
                                </button>
                                <button
                                    onClick={() => { setSeismic(!seismic); setActiveScenario(null); }}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm
                                                font-medium transition-all ${
                                        seismic
                                            ? "bg-red-50 border-red-400 text-red-800"
                                            : "bg-white border-slate-200 text-slate-500 hover:border-red-200"
                                    }`}
                                >
                                    <Activity className={`h-4 w-4 ${seismic ? "text-red-500" : "text-slate-300"}`} />
                                    Seismic
                                    <span className={`ml-auto text-xs font-bold ${seismic ? "text-red-500" : "text-slate-300"}`}>
                                        {seismic ? "ON" : "OFF"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 3 — Analyze */}
                <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Step 3 — Run the prediction
                    </p>
                    <Button
                        className="w-full h-11 text-sm font-semibold bg-slate-900 hover:bg-slate-800
                                   disabled:opacity-40 transition-all"
                        onClick={analyze}
                        disabled={loading || !hasSignal}
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</>
                        ) : (
                            <>Analyze Risk <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                    {!hasSignal && (
                        <p className="text-xs text-slate-400 text-center mt-2">
                            Pick a scenario above to enable the button.
                        </p>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <XCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-400" />
                    <div>
                        <p className="text-sm font-semibold text-red-700 mb-0.5">Prediction failed</p>
                        <pre className="text-xs font-mono text-red-600 whitespace-pre-wrap">{error}</pre>
                    </div>
                </div>
            )}

            {/* Result */}
            {result && s && (
                <div className={`rounded-2xl border-2 ${s.border} shadow-md
                                 animate-in slide-in-from-bottom-3 duration-400 overflow-hidden`}>

                    {/* Risk header */}
                    <div className={`${s.bg} p-5 flex items-center gap-4`}>
                        <div className={`w-16 h-16 rounded-full ${s.pill} flex flex-col items-center
                                         justify-center shrink-0 shadow-sm`}>
                            <span className="text-lg font-black text-white leading-none">
                                {result.confidence}%
                            </span>
                            <span className="text-[9px] text-white/80 uppercase tracking-wide font-medium">
                                conf.
                            </span>
                        </div>
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5
                                             rounded-full ${s.pill} text-white`}>
                                {s.label}
                            </span>
                            <h2 className={`text-xl font-black mt-1 ${s.text}`}>{result.prediction}</h2>
                            <p className="text-xs text-slate-500 mt-0.5">District: {district}</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-5 bg-white">

                        {/* Probability bars */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                Disaster probabilities
                            </p>
                            <div className="space-y-2.5">
                                {sortedProbs.map(([cls, prob]) => {
                                    const pct   = Math.round(prob * 100);
                                    const color = BAR_COLOR[cls] ?? "#94a3b8";
                                    const isTop = cls === result.prediction;
                                    return (
                                        <div key={cls} className={isTop ? "" : "opacity-50"}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm font-semibold flex items-center gap-1.5 ${isTop ? "text-slate-900" : "text-slate-500"}`}>
                                                    {isTop && <AlertTriangle className="h-3.5 w-3.5" style={{ color }} />}
                                                    {cls}
                                                </span>
                                                <span className="text-sm font-mono font-bold text-slate-700">{pct}%</span>
                                            </div>
                                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-3 rounded-full transition-all duration-700"
                                                    style={{ width: `${pct}%`, backgroundColor: color }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                Safety recommendations
                            </p>
                            <div className="space-y-2">
                                {result.recommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg px-3 py-2.5">
                                        <span className={`shrink-0 w-5 h-5 rounded-full ${s.num} text-white
                                                          text-[10px] font-bold flex items-center justify-center`}>
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-slate-700">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
