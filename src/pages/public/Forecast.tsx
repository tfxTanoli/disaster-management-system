import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSun, Wind, Droplets, ArrowUp, ArrowDown } from "lucide-react";

type WeatherCardProps = {
    district: string;
    temp: number;
    condition: "Sunny" | "Cloudy" | "Rainy" | "Stormy" | "Snow";
    humidity: number;
    windSpeed: number;
    high: number;
    low: number;
};

const weatherData: WeatherCardProps[] = [
    { district: "Gilgit", temp: 18, condition: "Sunny", humidity: 45, windSpeed: 12, high: 22, low: 10 },
    { district: "Skardu", temp: 12, condition: "Cloudy", humidity: 30, windSpeed: 8, high: 15, low: 5 },
    { district: "Hunza", temp: 8, condition: "Rainy", humidity: 60, windSpeed: 15, high: 10, low: 3 },
    { district: "Diamer", temp: 24, condition: "Sunny", humidity: 40, windSpeed: 10, high: 28, low: 18 },
    { district: "Astore", temp: 5, condition: "Snow", humidity: 70, windSpeed: 20, high: 8, low: -2 },
    { district: "Ghanche", temp: 10, condition: "Cloudy", humidity: 35, windSpeed: 5, high: 12, low: 4 },
];

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
    switch (condition) {
        case "Sunny": return <CloudSun className={`text-yellow-500 ${className}`} />;
        case "Cloudy": return <Cloud className={`text-slate-400 ${className}`} />;
        case "Rainy": return <CloudRain className={`text-blue-500 ${className}`} />;
        case "Snow": return <CloudRain className={`text-cyan-300 ${className}`} />; // Fallback icon
        default: return <CloudSun className={`text-orange-500 ${className}`} />;
    }
};

export function Forecast() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
            <div className="container mx-auto max-w-6xl space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900">Regional Weather Forecast</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Real-time weather updates and 24-hour forecast for all districts in Gilgit-Baltistan to help planning and preparedness.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weatherData.map((data, index) => (
                        <Card key={index} className="border-0 shadow-lg overflow-hidden relative">
                            {/* Background accent based on condition */}
                            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 ${data.condition === 'Sunny' ? 'bg-yellow-400' :
                                    data.condition === 'Rainy' ? 'bg-blue-600' :
                                        'bg-slate-400'
                                }`} />

                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl flex justify-between items-center">
                                    {data.district}
                                    <WeatherIcon condition={data.condition} className="h-8 w-8" />
                                </CardTitle>
                                <p className="text-slate-500 font-medium">{data.condition}</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-end gap-2">
                                    <span className="text-6xl font-black text-slate-800">{data.temp}°</span>
                                    <div className="text-sm text-slate-500 mb-2 space-y-1">
                                        <div className="flex items-center gap-1"><ArrowUp className="h-3 w-3 text-red-500" /> H: {data.high}°</div>
                                        <div className="flex items-center gap-1"><ArrowDown className="h-3 w-3 text-blue-500" /> L: {data.low}°</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Droplets className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm font-medium">{data.humidity}% Humidity</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Wind className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium">{data.windSpeed} km/h Wind</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
