import { useEffect, useState } from "react";
import { Calendar, User, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function Blogs() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await supabase
                    .from('content')
                    .select('*')
                    .in('type', ['blog', 'article'])
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (data) setArticles(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Knowledge Base
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                        Disaster Management <span className="text-blue-600">Insights</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        Expert articles, updates, and stories from the field to keep you informed and prepared.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <div key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 flex flex-col">
                                <div className="relative h-48 overflow-hidden bg-slate-200">
                                    {article.url ? (
                                        <img
                                            src={article.url}
                                            alt={article.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <BookOpen className="h-12 w-12 opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-slate-900 rounded-full uppercase tracking-wider">
                                            {article.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4">
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                                        {article.body}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center text-sm font-medium text-slate-900">
                                            <User className="h-4 w-4 mr-2 text-slate-400" />
                                            {article.author_name || 'Admin'}
                                        </div>
                                        {/* Optional Read More functionality */}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {articles.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                No articles published yet.
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <p className="text-slate-500 mb-6">Want to receive these updates strictly to your inbox?</p>
                    <div className="max-w-md mx-auto flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <Button>Subscribe</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
