import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Blogs() {
    const articles = [
        {
            id: 1,
            title: "Preparing for Monsoon Season: A Comprehensive Guide",
            excerpt: "As the monsoon season approaches, learn the essential steps to secure your home and family against potential flooding and landslides.",
            author: "Dr. Sarah Khan",
            date: "May 15, 2026",
            category: "Preparedness",
            image: "https://images.unsplash.com/photo-1547683905-f686c993aee5?q=80&w=2000&auto=format&fit=crop",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "Understanding Seismic Activity in Northern Areas",
            excerpt: "An in-depth look at the geological factors that make Gilgit-Baltistan seismically active and what recent data tells us about future risks.",
            author: "Geological Survey Team",
            date: "April 28, 2026",
            category: "Research",
            image: "https://images.unsplash.com/photo-1517089456903-516d00df7025?q=80&w=2000&auto=format&fit=crop",
            readTime: "8 min read"
        },
        {
            id: 3,
            title: "Community Response Teams: The First Line of Defense",
            excerpt: "Highlighting the heroic efforts of local volunteers who act as the first responders during remote emergencies.",
            author: "Ali Ahmed",
            date: "June 02, 2026",
            category: "Community",
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2000&auto=format&fit=crop",
            readTime: "6 min read"
        }
    ];

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

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <div key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-slate-900 rounded-full uppercase tracking-wider">
                                        {article.category}
                                    </span>
                                </div>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {article.date}
                                    </div>
                                    <div>{article.readTime}</div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-6 flex-1">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center text-sm font-medium text-slate-900">
                                        <User className="h-4 w-4 mr-2 text-slate-400" />
                                        {article.author}
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto">
                                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
