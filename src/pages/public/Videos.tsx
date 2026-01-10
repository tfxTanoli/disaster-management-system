import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";

type VideoProps = {
    id: number;
    title: string;
    category: "Training" | "Awareness" | "News";
    duration: string;
    thumbnailColor: string;
    views: string;
    date: string;
};

const videos: VideoProps[] = [
    { id: 1, title: "Earthquake Safety Drill 2024", category: "Training", duration: "12:30", thumbnailColor: "bg-orange-100", views: "1.2k views", date: "2 weeks ago" },
    { id: 2, title: "Glacial Lake Outburst Flood (GLOF) Awareness", category: "Awareness", duration: "05:45", thumbnailColor: "bg-blue-100", views: "3.5k views", date: "1 month ago" },
    { id: 3, title: "First Aid Basics: CPR Technique", category: "Training", duration: "08:15", thumbnailColor: "bg-red-100", views: "10k views", date: "3 months ago" },
    { id: 4, title: "Emergency Kit Preparation Guide", category: "Awareness", duration: "04:20", thumbnailColor: "bg-green-100", views: "5.1k views", date: "4 months ago" },
    { id: 5, title: "Recent Landslide Response in Hunza", category: "News", duration: "03:10", thumbnailColor: "bg-slate-200", views: "8.2k views", date: "5 months ago" },
    { id: 6, title: "Community Evacuation Routes", category: "Training", duration: "15:00", thumbnailColor: "bg-yellow-100", views: "900 views", date: "6 months ago" },
];

export function Videos() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900">Video Gallery</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Watch educational content, training modules, and latest updates on disaster management.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <Card key={video.id} className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all">
                            {/* Mock Thumbnail with Overlay */}
                            <div className={`aspect-video w-full ${video.thumbnailColor} relative flex items-center justify-center group-hover:bg-opacity-80 transition-colors`}>
                                <PlayCircle className="h-16 w-16 text-slate-900 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {video.duration}
                                </span>
                            </div>

                            <CardHeader className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={video.category === "Training" ? "default" : video.category === "News" ? "destructive" : "secondary"}>
                                        {video.category}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                    {video.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>{video.views}</span>
                                    <span>{video.date}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
