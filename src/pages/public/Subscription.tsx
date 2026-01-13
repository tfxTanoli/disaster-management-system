import { Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Subscription() {
    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                        Choose Your Protection Plan
                    </h1>
                    <p className="text-lg text-slate-600">
                        Get advanced features, priority alerts, and detailed offline maps to ensure maximum safety for you and your family.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative">
                        <h3 className="text-xl font-bold text-slate-900">Basic</h3>
                        <p className="text-slate-500 text-sm mt-2">Essential protection for everyone.</p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold text-slate-900">Free</span>
                        </div>
                        <Link to="/signup">
                            <Button variant="outline" className="w-full mb-8 border-slate-300">Get Started</Button>
                        </Link>
                        <ul className="space-y-4 flex-1">
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">Public Disaster Alerts</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">Access to Safety Guidelines</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">Report Incidents</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">Basic Risk Map Access</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 flex flex-col relative transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold text-white">Pro Shield</h3>
                        <p className="text-slate-400 text-sm mt-2">Advanced tools for proactive safety.</p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold text-white">PKR 1500</span>
                            <span className="text-slate-500 ml-2">/year</span>
                        </div>
                        <Button className="w-full mb-8 bg-red-600 hover:bg-red-700 text-white font-bold">Subscribe Now</Button>
                        <ul className="space-y-4 flex-1">
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">Everything in Basic</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">SMS & Automated Call Alerts</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">Offline Map Downloads</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">Family Safety Tracking</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">AI Risk Prediction Reports</span>
                            </li>
                        </ul>
                    </div>

                    {/* Enterprise/Organization Plan */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col relative">
                        <h3 className="text-xl font-bold text-slate-900">Organization</h3>
                        <p className="text-slate-500 text-sm mt-2">For NGOs, Hotels, and Institutions.</p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold text-slate-900">Custom</span>
                        </div>
                        <Link to="/contact">
                            <Button variant="outline" className="w-full mb-8 border-slate-300">Contact Sales</Button>
                        </Link>
                        <ul className="space-y-4 flex-1">
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">Multi-user Management</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">API Access for Data Integration</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">Dedicated Account Manager</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-600 text-sm">Custom Reporting & Analysis</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 border-t border-slate-200 pt-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Subscribe?</h3>
                            <p className="text-slate-600 mb-6">
                                Subscription fees go directly towards maintaining our sensor network, improving our AI models, and supporting local relief efforts. By subscribing, you are not just buying a tool, you are investing in the safety of Gilgit-Baltistan.
                            </p>
                            <div className="flex items-center space-x-4 text-slate-700">
                                <Shield className="h-12 w-12 text-blue-600" />
                                <div>
                                    <p className="font-bold">Secure Payment</p>
                                    <p className="text-sm">Processed securely via Stripe/EasyPaisa</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-100 rounded-xl p-8">
                            <blockquote className="space-y-3">
                                <p className="text-lg text-slate-700 italic">
                                    "The Pro Shield offline maps saved us when we got stranded near Hunza during a landslide. The alerts came through even with spotty signal."
                                </p>
                                <footer className="font-bold text-slate-900">– Ahmed K., Tourist</footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
