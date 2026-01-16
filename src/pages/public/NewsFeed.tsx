import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertTriangle, FileText, Image as ImageIcon, X, Trash2, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from 'sonner';

interface FeedItem {
    id: string;
    type: 'alert' | 'blog' | 'article' | 'video' | 'report';
    title: string;
    description?: string; // For reports/blogs body
    location?: string; // For reports
    media_url?: string; // For video/image
    severity?: string; // For alerts
    author?: string; // For basic attribution
    user_id?: string; // For ownership check
    created_at: string;
}

export function NewsFeed() {
    const { user } = useAuth();
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Posting State
    const [postType, setPostType] = useState<string>('blog');
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);

    // Lightbox State
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'video' | 'image' } | null>(null);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            // 1. Fetch Active Alerts
            const { data: alerts } = await supabase
                .from('alerts')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });

            // 2. Fetch Published Content
            const { data: content } = await supabase
                .from('content')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            // 3. Fetch Verified Reports
            const { data: reports } = await supabase
                .from('reports')
                .select('*')
                .eq('status', 'verified')
                .order('created_at', { ascending: false });

            // Normalize and Merge
            const combinedFeed: FeedItem[] = [];

            if (alerts) {
                alerts.forEach((a: any) => combinedFeed.push({
                    id: a.id,
                    type: 'alert',
                    title: a.title,
                    description: a.message,
                    severity: a.severity,
                    created_at: a.created_at
                }));
            }

            if (content) {
                content.forEach((c: any) => combinedFeed.push({
                    id: c.id,
                    type: c.type, // blog, article, video
                    title: c.title,
                    description: c.body,
                    media_url: c.url,
                    author: c.author_name, // Should be populated after migration
                    user_id: c.user_id, // Capture user_id
                    created_at: c.created_at
                }));
            }

            if (reports) {
                reports.forEach((r: any) => combinedFeed.push({
                    id: r.id,
                    type: 'report',
                    title: `Incident Report: ${r.type}`,
                    description: r.description,
                    location: r.location,
                    media_url: r.image_url,
                    author: r.name,
                    user_id: r.user_id,
                    created_at: r.created_at
                }));
            }

            // Sort by date (newest first)
            combinedFeed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setFeed(combinedFeed);

        } catch (error) {
            console.error("Error fetching feed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();

        // Use a simple polling fallback for now or real-time if crucial
        const interval = setInterval(fetchFeed, 30000);
        return () => clearInterval(interval);
    }, []);

    // --- POSTING LOGIC ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));

            if (selectedFile.type.startsWith('video/')) {
                setPostType('video');
            } else {
                setPostType('blog'); // Default to blog/image
            }
        }
    };

    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
    };

    const uploadFile = async (): Promise<string | null> => {
        if (!file) return null;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('content-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('content-assets')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error: any) {
            toast.error('Error uploading file', { description: error.message });
            return null;
        }
    };

    const createPost = async () => {
        if (!user) { toast.warning('Please login to post'); return; }
        if (!postBody && !file) { toast.warning('Please add some text or media'); return; }

        setIsPosting(true);
        let finalUrl = '';

        if (file) {
            const uploadedUrl = await uploadFile();
            if (uploadedUrl) finalUrl = uploadedUrl;
            else {
                setIsPosting(false);
                return; // Upload failed
            }
        }

        try {
            const { error } = await supabase.from('content').insert({
                title: postTitle || "Untitled Post",
                body: postBody,
                type: postType,
                url: finalUrl,
                status: 'published',
                author_name: user.name || 'Anonymous',
                user_id: user.id
            });

            if (error) throw error;

            // Reset and Refresh
            setPostTitle('');
            setPostBody('');
            clearFile();
            fetchFeed();
            toast.success('Posted successfully!');
        } catch (e: any) {
            console.error(e);
            toast.error('Failed to post', { description: e.message });
        } finally {
            setIsPosting(false);
        }
    };

    const deletePost = async (id: string, type: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            // Determine table based on type
            const table = type === 'report' ? 'reports' : 'content';

            const { error } = await supabase.from(table).delete().eq('id', id);

            if (error) throw error;

            // Remove from local state immediately for UI responsiveness
            setFeed(feed.filter(item => item.id !== id));
            toast.success('Deleted successfully');
        } catch (error: any) {
            toast.error('Error deleting', { description: error.message });
        }
    };



    return (
        <div className="container mx-auto p-4 max-w-2xl space-y-8">
            <div className="text-center space-y-1 py-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">News Feed</h1>
                <p className="text-slate-500">Real-time updates from the community and authorities.</p>
            </div>

            {/* --- CREATE POST SECTION --- */}
            {user ? (
                <Card className="shadow-md border-slate-200">
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                                {user.name?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 space-y-3">
                                <Textarea
                                    placeholder={`What's happening, ${user.name}?`}
                                    className="border-none resize-none focus-visible:ring-0 px-0 text-lg min-h-[60px]"
                                    value={postBody}
                                    onChange={(e) => setPostBody(e.target.value)}
                                />
                                {filePreview && (
                                    <div className="relative rounded-lg overflow-hidden bg-slate-100">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
                                            onClick={clearFile}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        {file?.type.startsWith('video/') ? (
                                            <video src={filePreview} controls className="w-full max-h-[300px] object-cover" />
                                        ) : (
                                            <img src={filePreview} alt="Preview" className="w-full max-h-[300px] object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-between items-center border-t border-slate-100 pt-3 gap-2">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="feed-upload"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="feed-upload">
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 cursor-pointer text-slate-600 text-sm font-medium transition-colors">
                                            <ImageIcon className="h-5 w-5 text-green-600" />
                                            Photo/Video
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <Button onClick={createPost} disabled={isPosting} className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 w-full sm:w-auto">
                                {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-slate-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <p className="text-slate-600 mx-auto">Log in to share updates, photos, and videos with the community.</p>
                        <Link to="/login">
                            <Button variant="outline">Sign In to Post</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* --- FEED --- */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
                </div>
            ) : (
                <div className="space-y-6">
                    {feed.map((item) => (
                        <Card key={item.id} className="overflow-hidden shadow-sm border-slate-200">
                            {/* Alert Header Special Styling */}
                            {item.type === 'alert' ? (
                                <div className="bg-red-50 p-4 border-b border-red-100 flex items-start gap-3">
                                    <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-red-900 text-lg">{item.title}</h3>
                                        <p className="text-red-800 text-sm mt-1">{item.description}</p>
                                        <p className="text-red-400 text-xs mt-2 uppercase font-semibold">{item.severity} Priority • {new Date(item.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                            {(item.author?.[0] || 'A').toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">
                                                {item.author || (item.type === 'report' ? 'Citizen Reporter' : 'Admin')}
                                                <span className="font-normal text-slate-500"> uploaded a {item.type}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                {new Date(item.created_at).toLocaleString()}
                                                {item.location && <span>• {item.location}</span>}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {item.type !== 'report' && item.title && item.title !== "Untitled Post" && (
                                            <h4 className="font-medium text-lg">{item.title}</h4>
                                        )}
                                        <p className="text-slate-800 whitespace-pre-wrap text-[15px]">{item.description}</p>

                                        {item.media_url && (
                                            <div className="mt-2 rounded-lg overflow-hidden border border-slate-100 bg-black flex justify-center items-center relative group">
                                                {(item.type === 'video' || item.media_url.includes('.mp4')) ? (
                                                    <video
                                                        src={item.media_url}
                                                        controls
                                                        className="w-full max-h-[500px] bg-black"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <>
                                                        <img
                                                            src={item.media_url}
                                                            alt="Post content"
                                                            className="w-full max-h-[500px] object-contain bg-black cursor-pointer"
                                                            onClick={() => setSelectedMedia({ url: item.media_url!, type: 'image' })}
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => setSelectedMedia({ url: item.media_url!, type: 'image' })}
                                                        >
                                                            <Maximize2 className="h-4 w-4 mr-1" /> Expand
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="border-t pt-3 pb-3 px-4 flex justify-between items-center text-slate-500">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <FileText className="h-4 w-4" /> Details
                                        </Button>

                                        {user && (item.user_id === user.id || user.role === 'admin') && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deletePost(item.id, item.type)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </Button>
                                        )}
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    ))}

                    {feed.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            No news yet. Be the first to post!
                        </div>
                    )}
                </div>
            )}
            {/* Lightbox Dialog */}
            <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/90 border-none flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white z-50 bg-black/50 rounded-full p-2"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        {selectedMedia?.type === 'video' ? (
                            <video src={selectedMedia.url} controls className="max-w-full max-h-[85vh] object-contain" autoPlay />
                        ) : (
                            <img src={selectedMedia?.url} alt="Full view" className="max-w-full max-h-[85vh] object-contain" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
