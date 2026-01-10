import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Shield, History, MapPin, CheckCircle2 } from "lucide-react";

export function About() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white min-h-[400px] flex items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950"></div>
                <div className="container mx-auto px-4 relative z-10 py-20 pb-28">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center space-x-2 text-red-400 font-bold uppercase tracking-wider text-sm mb-4">
                            <span className="w-8 h-0.5 bg-red-400"></span>
                            <span>Who We Are</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            Protecting Every Life in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Gilgit-Baltistan</span>
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                            The Gilgit-Baltistan Disaster Management Authority (GB-DMA) acts as the central shield against natural calamities, ensuring resilience through proactive planning and rapid response.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Overlapping Cards */}
            <section className="container mx-auto px-4 -mt-20 relative z-20 pb-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="shadow-2xl shadow-slate-200/50 border-0 bg-white/95 backdrop-blur rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="h-2 w-full bg-red-600"></div>
                        <CardHeader>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 text-red-600">
                                <Target className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-3xl font-bold text-slate-800">Our Mission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To proactively manage disaster risks through comprehensive planning, swift response mechanisms, and effective recovery strategies. We aim to minimize the impact of natural and man-made disasters on the people and economy of Gilgit-Baltistan using data-driven insights.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl shadow-slate-200/50 border-0 bg-white/95 backdrop-blur rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="h-2 w-full bg-blue-600"></div>
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 text-blue-600">
                                <Shield className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-3xl font-bold text-slate-800">Our Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                A disaster-resilient Gilgit-Baltistan where communities are safer, empowered, and prepared. We strive to be a model of excellence in disaster management, leveraging technology, AI, and continuous community engagement.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Core Principles</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-md text-slate-900 mb-4">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900">Community Centric</h3>
                            <p className="text-slate-500 leading-relaxed">We place the safety and well-being of our local communities at the heart of every decision we make.</p>
                        </div>
                        <div className="space-y-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-md text-slate-900 mb-4">
                                <History className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900">Resilience</h3>
                            <p className="text-slate-500 leading-relaxed">Building infrastructure and systems that can withstand and recover quickly from shocks and stresses.</p>
                        </div>
                        <div className="space-y-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-md text-slate-900 mb-4">
                                <MapPin className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900">Rapid Response</h3>
                            <p className="text-slate-500 leading-relaxed">Strategically located centers across all districts to ensure help reaches where it is needed, fast.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Structure Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-bold mb-6">Organizational Structure</h2>
                            <p className="text-slate-400 mb-6">
                                Led by the Director General, our organization acts as a cohesive unit comprising specialized wings that handle every aspect of disaster management.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> Operations & Response Wing
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> Planning & Development Wing
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> Finance & Admin Wing
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> HR & Training Wing
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                                <div className="h-full flex flex-col justify-between">
                                    <h4 className="font-bold text-lg mb-2">Director General</h4>
                                    <p className="text-sm text-slate-400">Provides strategic leadership and oversight.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                                <div className="h-full flex flex-col justify-between">
                                    <h4 className="font-bold text-lg mb-2">District Authorities (DDMAs)</h4>
                                    <p className="text-sm text-slate-400">Implement policies at the grassroots level.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                                <div className="h-full flex flex-col justify-between">
                                    <h4 className="font-bold text-lg mb-2">Technical Committee</h4>
                                    <p className="text-sm text-slate-400">Experts in geology, glaciology, and seismology.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                                <div className="h-full flex flex-col justify-between">
                                    <h4 className="font-bold text-lg mb-2">Emergency Response Force</h4>
                                    <p className="text-sm text-slate-400">Specialized personnel for search and rescue.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
