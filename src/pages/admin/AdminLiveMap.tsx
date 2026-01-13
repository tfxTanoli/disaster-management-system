import { RiskMap } from "../public/RiskMap";

export function AdminLiveMap() {
    return (
        <div className="h-[calc(100vh-8rem)]">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Admin Live Map</h1>
                <p className="text-slate-500">Real-time disaster risk monitoring.</p>
            </div>
            <div className="border rounded-lg overflow-hidden h-full">
                <RiskMap />
            </div>
        </div>
    );
}
