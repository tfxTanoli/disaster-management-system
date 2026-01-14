import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Trash2, AlertTriangle, Image as ImageIcon, X, Megaphone, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ContentItem {
    id: string;
    title: string;
    body: string;
    type: 'blog' | 'article' | 'video';
    url?: string;
    status: 'draft' | 'published';
    created_at: string;
    author_name?: string;
    user_id?: string;
}

interface AlertItem {
    id: string;
    title: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    active: boolean;
    created_at: string;
}

export function AdminContent() {
    const { user } = useAuth();
    const [contents, setContents] = useState<ContentItem[]>([]);
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [postType, setPostType] = useState<string>('blog');
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [postUrl, setPostUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<string>('info');

    // Lightbox State
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'video' | 'image' } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: contentData } = await supabase.from('content').select('*').order('created_at', { ascending: false });
            const { data: alertData } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });

            if (contentData) setContents(contentData as ContentItem[]);
            if (alertData) setAlerts(alertData as AlertItem[]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const contentSub = supabase.channel('content-list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, fetchData)
            .subscribe();

        const alertSub = supabase.channel('alerts-list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, fetchData)
            .subscribe();

        return () => {
            contentSub.unsubscribe();
            alertSub.unsubscribe();
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));

            // Auto-detect type
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
            alert('Error uploading file: ' + error.message);
            return null;
        }
    };

    const createContent = async () => {
        // Validation: Needs either text or a file
        if (!postBody && !file && !postUrl) return alert("Please add some text or media.");

        let finalUrl = postUrl;

        // If file selected, upload it
        if (file) {
            const uploadedUrl = await uploadFile();
            if (uploadedUrl) finalUrl = uploadedUrl;
            else return; // Upload failed
        }

        try {
            const { error } = await supabase.from('content').insert({
                title: postTitle || "Untitled Post",
                body: postBody,
                type: postType,
                url: finalUrl,
                status: 'published',
                author_name: user?.name || 'Admin',
                user_id: user?.id
            });
            if (error) throw error;

            // Reset form
            setPostTitle('');
            setPostBody('');
            setPostUrl('');
            clearFile();
            alert("Posted successfully!");
        } catch (e: any) {
            alert(e.message);
        }
    };

    const deleteContent = async (id: string) => {
        if (!confirm("Delete this post?")) return;
        await supabase.from('content').delete().eq('id', id);
    };



    const createAlert = async () => {
        if (!alertTitle || !alertMessage) return alert("Title and Message are required");

        try {
            const { error } = await supabase.from('alerts').insert({
                title: alertTitle,
                message: alertMessage,
                severity: alertSeverity,
                active: true
            });
            if (error) throw error;

            setAlertTitle('');
            setAlertMessage('');
            alert("Alert broadcasted!");
        } catch (e: any) {
            alert(e.message);
        }
    };

    const deleteAlert = async (id: string) => {
        if (!confirm("Remove this alert record?")) return;
        await supabase.from('alerts').delete().eq('id', id);
    };

    const toggleAlertActive = async (item: AlertItem) => {
        await supabase.from('alerts').update({ active: !item.active }).eq('id', item.id);
    };

    return (
        <div className="space-y-6 container mx-auto p-6 max-w-5xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Content & Alerts</h1>
                <p className="text-slate-500">Create posts, share updates, and manage emergency alerts.</p>
            </div>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-full md:max-w-[400px]">
                    <TabsTrigger value="posts">News Feed</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                {/* --- POSTS TAB --- */}
                <TabsContent value="posts" className="space-y-6 mt-6">
                    {/* Social Media Style Creator */}
                    <Card className="shadow-md border-slate-200">
                        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-lg font-medium text-slate-700">Create Post</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <Input
                                placeholder="Post Title (Optional)"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="font-medium text-lg border-none hover:bg-slate-50 focus:ring-0 px-0"
                            />
                            <Textarea
                                placeholder={`What's on your mind, ${user?.name || 'Admin'}?`}
                                className="min-h-[100px] border-none text-base resize-none focus-visible:ring-0 px-0"
                                value={postBody}
                                onChange={(e) => setPostBody(e.target.value)}
                            />

                            {/* File Preview */}
                            {filePreview && (
                                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 mt-2">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-sm z-10"
                                        onClick={clearFile}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    {file?.type.startsWith('video/') ? (
                                        <video src={filePreview} controls className="w-full max-h-[300px] object-contain bg-black" />
                                    ) : (
                                        <img src={filePreview} alt="Preview" className="w-full max-h-[300px] object-contain bg-black" />
                                    )}
                                </div>
                            )}

                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between border-t border-slate-100 pt-3 gap-3">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-upload">
                                        <Button variant="ghost" size="sm" className="text-slate-600 gap-2 cursor-pointer" type="button" asChild>
                                            <span><ImageIcon className="h-5 w-5 text-green-600" /> Photo/Video</span>
                                        </Button>
                                    </label>
                                </div>
                                <Select value={postType} onValueChange={setPostType}>
                                    <SelectTrigger className="w-[130px] border-none bg-transparent shadow-none hover:bg-slate-50 h-9">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="blog">Update</SelectItem>
                                        <SelectItem value="article">Article</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={createContent} className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700">
                                Post
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Posts List */}
                    <div className="grid gap-6">
                        {loading ? (
                            <div className="text-center py-10"><Loader2 className="animate-spin h-8 w-8 mx-auto text-slate-400" /></div>
                        ) : contents.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">No posts yet.</div>
                        ) : (
                            contents.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                    <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                            {(item.author_name?.[0] || item.title[0] || 'A').toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base font-semibold">
                                                {item.author_name || 'Admin'}
                                                <span className="font-normal text-slate-500"> uploaded a {item.type}</span>
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {new Date(item.created_at).toLocaleString()}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                                            {item.status}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {item.title && item.title !== "Untitled Post" && (
                                            <h3 className="font-medium text-lg">{item.title}</h3>
                                        )}
                                        <p className="text-slate-800 whitespace-pre-wrap">{item.body}</p>

                                        {item.url && (
                                            <div className="rounded-lg overflow-hidden border border-slate-200 bg-black flex justify-center items-center relative group">
                                                {(item.type === 'video' || item.url.includes('.mp4')) ? (
                                                    <video
                                                        src={item.url}
                                                        controls
                                                        className="w-full max-h-[500px] bg-black"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <>
                                                        <img
                                                            src={item.url}
                                                            alt="Content"
                                                            className="w-full max-h-[500px] object-contain bg-black cursor-pointer"
                                                            onClick={() => setSelectedMedia({ url: item.url!, type: 'image' })}
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => setSelectedMedia({ url: item.url!, type: 'image' })}
                                                        >
                                                            <Maximize2 className="h-4 w-4 mr-1" /> Expand
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="justify-end border-t bg-slate-50/50 py-3">

                                        <Button variant="ghost" size="sm" onClick={() => deleteContent(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* --- ALERTS TAB --- */}
                <TabsContent value="alerts" className="space-y-6 mt-6">
                    <Card className="border-red-100 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="text-red-700 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" /> Broadcast Emergency Alert
                            </CardTitle>
                            <CardDescription>
                                These alerts will appear prominently at the top of the public news feed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <Select value={alertSeverity} onValueChange={setAlertSeverity}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info (Blue)</SelectItem>
                                        <SelectItem value="low">Low (Green)</SelectItem>
                                        <SelectItem value="medium">Medium (Orange)</SelectItem>
                                        <SelectItem value="high">High (Red)</SelectItem>
                                        <SelectItem value="critical">Critical (Dark Red)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Alert Headline"
                                    className="flex-1 bg-white"
                                    value={alertTitle}
                                    onChange={(e) => setAlertTitle(e.target.value)}
                                />
                            </div>
                            <Textarea
                                placeholder="Detailed instructions for the public..."
                                className="min-h-[100px] bg-white"
                                value={alertMessage}
                                onChange={(e) => setAlertMessage(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button onClick={createAlert} variant="destructive">
                                <Megaphone className="mr-2 h-4 w-4" /> Broadcast Alert
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="grid gap-4">
                        <h2 className="text-xl font-semibold">Active Alerts</h2>
                        {loading ? (
                            <div className="text-center py-10"><Loader2 className="animate-spin h-8 w-8 mx-auto text-slate-400" /></div>
                        ) : alerts.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">No active alerts.</div>
                        ) : (
                            alerts.map((item) => (
                                <Card key={item.id} className={`overflow-hidden ${!item.active ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <div className="flex items-start p-4 gap-3">
                                        <div className="p-3 rounded-full bg-red-100">
                                            <AlertTriangle className={`h-6 w-6 text-${item.severity === 'critical' || item.severity === 'high' ? 'red' : 'orange'}-600`} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-lg text-red-900">{item.title}</h3>
                                                <Badge variant={item.active ? 'destructive' : 'outline'}>
                                                    {item.active ? 'Active' : 'Archived'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-700">{item.message}</p>
                                            <p className="text-xs text-slate-400 mt-2">Severity: {item.severity.toUpperCase()} • {new Date(item.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" size="sm" onClick={() => toggleAlertActive(item)}>
                                                {item.active ? "Deactivate" : "Re-activate"}
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteAlert(item.id)}>
                                                <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

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
