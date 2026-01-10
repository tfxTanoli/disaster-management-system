import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, ArrowRight, AlertOctagon } from "lucide-react";
import { Link } from "react-router-dom";

export function Contact() {
    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in duration-700">

            {/* Header Section */}
            <section className="bg-slate-900 text-white py-20 px-4">
                <div className="container mx-auto text-center max-w-4xl space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Get in Touch</h1>
                    <p className="text-lg md:text-xl text-slate-300">
                        We are always here to help. Reach out to us for queries, support, or emergency reporting.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-10 relative z-10 pb-20">

                {/* Emergency Alert Strip */}
                <div className="rounded-xl overflow-hidden shadow-lg bg-red-600 text-white mb-12 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 animate-pulse-slow">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="p-3 bg-white/20 rounded-full">
                            <AlertOctagon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl">Emergency Situation?</h3>
                            <p className="text-red-100">Don't use the form. Call our hotline immediately.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center md:text-right">
                            <span className="block text-xs uppercase opacity-80 font-bold tracking-wider">24/7 Hotline</span>
                            <span className="text-4xl font-black tracking-tight">1122</span>
                        </div>
                        <Link to="/report-incident">
                            <Button className="bg-white text-red-600 hover:bg-red-50 border-0 font-bold whitespace-nowrap">
                                Report Online <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-slate-900 text-white border-slate-800 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Contact Info</CardTitle>
                                <CardDescription className="text-slate-400">Direct channels to reach GBDMA HQ.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-red-500 mt-1 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-white">Headquarters</h4>
                                        <p className="text-slate-400 text-sm mt-1">
                                            GB Disaster Management Authority<br />
                                            Civil Secretariat, Chinar Bagh<br />
                                            Gilgit, 15100
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Phone className="w-6 h-6 text-blue-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-white">Phone</h4>
                                        <p className="text-slate-400 text-sm">+92-5811-920200</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Mail className="w-6 h-6 text-green-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-white">Email</h4>
                                        <p className="text-slate-400 text-sm">info@gbdma.gov.pk</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Clock className="w-6 h-6 text-orange-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-white">Working Hours</h4>
                                        <p className="text-slate-400 text-sm">Mon - Fri: 09:00 AM - 05:00 PM</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Regional Offices Map Placeholder/List */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Regional Offices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex justify-between border-b pb-2"><span>Skardu</span> <span className="font-semibold text-slate-900">+92-5815-920100</span></li>
                                    <li className="flex justify-between border-b pb-2"><span>Diamer</span> <span className="font-semibold text-slate-900">+92-5812-920050</span></li>
                                    <li className="flex justify-between border-b pb-2"><span>Ghanche</span> <span className="font-semibold text-slate-900">+92-5816-920080</span></li>
                                    <li className="flex justify-between pt-1"><span>Hunza</span> <span className="font-semibold text-slate-900">+92-5813-920020</span></li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* General Inquiry Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-t-4 border-t-slate-900 h-full">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-2xl text-slate-900">Send us a Message</CardTitle>
                                <CardDescription>For non-emergency queries, feedback, or suggestions.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input id="first-name" placeholder="Enter first name" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input id="last-name" placeholder="Enter last name" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="you@company.com" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    {/* Replaced Select with Input for simplicity or use proper Select component if available/imported correctly */}
                                    <Input id="subject" placeholder="What is this regarding?" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none" />
                                </div>

                                <div className="pt-4">
                                    <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white min-w-[200px] h-12 text-lg">
                                        Send Message
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
