import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Videos() {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await supabase
                    .from('content')
                    .select('*')
                    .eq('type', 'video')
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (data) setVideos(data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900">Video Gallery</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Watch educational content, training modules, and latest updates on disaster management.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <Card key={video.id} className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all">
                                {/* Video Player/Thumbnail */}
                                <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                                    {video.url ? (
                                        <video
                                            src={video.url}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <PlayCircle className="h-16 w-16 mb-2 opacity-50" />
                                            <span className="text-sm">No video source</span>
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary">Video</Badge>
                                        <span className="text-xs text-slate-500">{new Date(video.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {video.title || "Untitled Video"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {video.body}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                        {videos.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                No videos uploaded yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
