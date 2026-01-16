import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Loader2, ArrowLeft, Share2, Printer, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface BlogContent {
    id: string;
    title: string;
    body: string;
    type: string;
    url?: string;
    author_name?: string;
    created_at: string;
}

export function BlogDetail() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<BlogContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('content')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) setArticle(data);
            } catch (error) {
                console.error("Error fetching article:", error);
                toast.error("Could not load article");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
        // Scroll to top when opening a new article
        window.scrollTo(0, 0);
    }, [id]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        } catch {
            toast.error('Failed to copy link');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Article Not Found</h1>
                <p className="text-slate-500 mb-6">The content you are looking for has been removed or does not exist.</p>
                <Link to="/blogs">
                    <Button>Back to News Feed</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-10">
            {/* Main Content Container */}
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Navigation Breadcrumb */}
                <div className="mb-8">
                    <Link
                        to="/news"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to News Feed
                    </Link>
                </div>

                <article>
                    {/* Header Section */}
                    <div className="text-center mb-10 space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge variant="secondary" className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 uppercase tracking-wider text-xs">
                                {article.type}
                            </Badge>
                            <span className="text-slate-400 text-xs">•</span>
                            <div className="flex items-center text-slate-500 text-sm">
                                <Clock className="h-3 w-3 mr-1" />
                                {Math.ceil(article.body.length / 500)} min read
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-sm text-slate-500 pt-2">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-red-500" />
                                <span className="font-medium text-slate-700">{article.author_name || 'GB-DMS Team'}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-red-500" />
                                <time dateTime={article.created_at}>
                                    {new Date(article.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {article.url && (
                        <div className="mb-10 rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/5 aspect-video relative bg-slate-100">
                            <img
                                src={article.url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                        <div className="prose prose-lg prose-slate max-w-none text-slate-700 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-red-600 hover:prose-a:text-red-700 prose-img:rounded-xl">
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {article.body}
                            </div>
                        </div>

                        {/* Footer Action Buttons */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleShare}
                                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share Post
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.print()}
                                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                </Button>
                            </div>

                            {/* Simple Back Link */}
                            {/* <Link to="/news">
                                <Button variant="ghost">Read more articles</Button>
                            </Link> */}
                        </div>
                    </div>
                </article>

                {/* Newsletter / CTA Section */}
                <Card className="mt-12 bg-slate-900 text-white border-none overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <CardContent className="p-8 md:p-12 text-center relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Stay Informed, Stay Safe</h2>
                        <p className="text-slate-300 max-w-xl mx-auto mb-6">
                            Get the latest disaster alerts and safety guidelines directly in your inbox.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button className="bg-red-600 hover:bg-red-700 text-white border-0 font-semibold px-8">
                                Subscribe to Alerts
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
