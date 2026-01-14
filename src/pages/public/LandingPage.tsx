import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert, Phone, BookOpen, ArrowRight, Activity } from "lucide-react";

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative w-full py-16 md:py-24 lg:py-32 bg-slate-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454789476662-53eb23ba5907?q=80&w=2552&auto=format&fit=crop')" }}
                ></div>
                <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center rounded-full border border-red-500/50 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 backdrop-blur-sm">
                        <Activity className="mr-2 h-4 w-4 animate-pulse" />
                        System Operational
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
                        Gilgit-Baltistan <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                            Disaster Management System
                        </span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-slate-300 md:text-xl">
                        Advanced real-time monitoring, early warning systems, and coordinated response for building a resilient future.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center pt-4">
                        <Link to="/alerts">
                            <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8">
                                <ShieldAlert className="mr-2 h-5 w-5" /> View Active Alerts
                            </Button>
                        </Link>
                        <Link to="/guidelines">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-slate-600 text-white hover:bg-slate-800 hover:text-white h-12 px-8">
                                <BookOpen className="mr-2 h-5 w-5" /> Survival Guidelines
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="container mx-auto px-4 py-16 -mt-16 relative z-20">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-xl bg-white p-6 md:p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 border-t-4 border-blue-500">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <BookOpen className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Preparedness</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            Comprehensive survival guides for floods, earthquakes, and landslides. Knowledge saves lives.
                        </p>
                        <Link to="/guidelines" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                            Access Guides <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl bg-white p-6 md:p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 border-t-4 border-red-500">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                            <Phone className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Emergency Contact</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            Immediate assistance is just a call away. Report incidents directly to our 24/7 control room.
                        </p>
                        <Link to="/contact" className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 hover:underline">
                            Report Emergency <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl bg-white p-6 md:p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 border-t-4 border-orange-500">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                            <ShieldAlert className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Live Alerts</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            Real-time updates on weather conditions, potential hazards, and active disaster alerts.
                        </p>
                        <Link to="/alerts" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 hover:underline">
                            Check Status <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission & Impact Section (New Content) */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-flex items-center text-red-600 font-semibold bg-red-50 px-4 py-1.5 rounded-full text-sm">
                                <Activity className="w-4 h-4 mr-2" /> Who We Are
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                                Building a Resilient <br /> Gilgit-Baltistan
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                The Gilgit-Baltistan Disaster Management Authority (GBDMA) works tirelessly to mitigate risks and ensure rapid response to natural calamities. Our integrated approach combines advanced technology with community empowerment.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">10+</h4>
                                    <p className="text-slate-500">Districts Covered</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">24/7</h4>
                                    <p className="text-slate-500">Monitoring Center</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">100k+</h4>
                                    <p className="text-slate-500">Citizens Protected</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">15min</h4>
                                    <p className="text-slate-500">Avg. Response Time</p>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link to="/about">
                                    <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                                        Learn More About Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl blur-2xl opacity-50 -z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1542601906990-24d4c16419d9?q=80&w=2670&auto=format&fit=crop"
                                alt="Disaster Response Team"
                                className="rounded-2xl shadow-2xl w-full h-auto object-cover transform transition-transform hover:scale-[1.01]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Promo (New Content) */}
            <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 opacity-50"></div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <h2 className="text-3xl font-bold mb-6">Stay Connected, Stay Safe</h2>
                    <p className="text-lg text-slate-300 mb-8">
                        Sign up for our digital platform to receive personalized alerts, report incidents instantly, and access offline survival guides.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-bold">
                                Create Account
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="bg-transparent border-slate-700 text-white hover:bg-slate-800">
                                Login to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>


        </div>
    );
}
