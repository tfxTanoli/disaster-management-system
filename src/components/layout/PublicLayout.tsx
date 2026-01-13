import { Link, Outlet } from "react-router-dom";
import { ShieldAlert, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";

export function PublicLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                        <span className="font-bold text-xl text-slate-900 tracking-tight">GB-DMS</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">Home</Link>
                        <Link to="/alerts" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">Alerts</Link>
                        <Link to="/guidelines" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">Guidelines</Link>
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">About</Link>
                        {isAuthenticated && (
                            <Link to="/risk-map" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">Check Risk</Link>
                        )}
                        <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">Contact</Link>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <Link to={user?.role === 'admin' ? "/admin/dashboard" : "/risk-map"}>
                                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                        <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                            {user?.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                                        </div>
                                        <span className="text-slate-700 font-medium">{user?.name}</span>
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => logout()} title="Sign Out">
                                    <LogOut className="h-5 w-5 text-slate-500 hover:text-red-600" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="outline" size="sm">Sign Up</Button>
                                </Link>
                            </>
                        )}
                        <Link to="/report-incident">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Emergency Report</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {
                    isMenuOpen && (
                        <div className="md:hidden border-b border-slate-200 bg-white">
                            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-red-600">Home</Link>
                                <Link to="/alerts" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-red-600">Alerts</Link>
                                <Link to="/guidelines" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-red-600">Guidelines</Link>
                                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-red-600">About</Link>
                                {isAuthenticated && (
                                    <Link to="/risk-map" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-red-600">Check Risk</Link>
                                )}
                                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-red-600">Contact</Link>
                                <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-2 flex items-center space-x-3 bg-slate-50 rounded-md">
                                                <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                                    {user?.name ? user.name[0].toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{user?.name}</p>
                                                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { logout(); setIsMenuOpen(false); }}>
                                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                                <Button variant="outline" className="w-full justify-start">Login</Button>
                                            </Link>
                                            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                                                <Button variant="outline" className="w-full justify-start">Sign Up</Button>
                                            </Link>
                                        </>
                                    )}
                                    <Link to="/report-incident" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white justify-start">Emergency Report</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                }
            </header >

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="mt-auto bg-slate-900 py-16 text-slate-400">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h2 className="text-white font-bold text-2xl flex items-center">
                            <ShieldAlert className="mr-2 h-6 w-6 text-red-500" />
                            GB-DMS
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Official Disaster Management System for Gilgit-Baltistan. Ensuring safety, preparedness, and rapid response.
                        </p>
                        <p className="text-xs pt-4">© 2026 GBDMA. All rights reserved.</p>
                    </div>

                    {/* Quick Link Column 1 */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-white font-semibold mb-2">Public Info</h3>
                        <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                        <Link to="/blogs" className="hover:text-white transition-colors">Blogs & Articles</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                        <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
                    </div>

                    {/* Quick Link Column 2 */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-white font-semibold mb-2">Resources</h3>
                        <Link to="/facilities" className="hover:text-white transition-colors">Facilities Directory</Link>
                        <Link to="/ngos" className="hover:text-white transition-colors">Partner NGOs</Link>
                        <Link to="/videos" className="hover:text-white transition-colors">Video Gallery</Link>
                        <Link to="/subscription" className="hover:text-white transition-colors">Subscription Plans</Link>
                        <Link to="/forecast" className="hover:text-white transition-colors">Weather Forecast</Link>
                        <Link to="/guidelines" className="hover:text-white transition-colors">Safety Guidelines</Link>
                    </div>

                    {/* Quick Link Column 3 */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-white font-semibold mb-2">Tools & Reports</h3>
                        <Link to="/damage-assessment" className="hover:text-white transition-colors">Report Damage</Link>
                        <Link to="/risk-map" className="hover:text-white transition-colors">Check Risk Map</Link>
                        <Link to="/report-incident" className="hover:text-white transition-colors">Emergency Report</Link>
                        <Link to="/alerts" className="hover:text-white transition-colors">Active Alerts</Link>
                    </div>
                </div>
            </footer>
        </div >
    );
}
