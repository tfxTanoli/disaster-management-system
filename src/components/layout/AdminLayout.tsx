import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Activity,
    Package,
    // Bell, 
    FileText,
    LogOut,
    ShieldAlert,
    Menu,
    Map,
    Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Close sidebar on mobile when route changes
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800";
    };

    return (
        <div className="h-screen bg-slate-100 flex overflow-hidden">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden glass-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:relative z-30 h-full bg-slate-900 transition-all duration-300 flex flex-col flex-shrink-0
                    ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}
            >
                <div className="h-16 flex items-center justify-center border-b border-slate-800 flex-shrink-0">
                    <Link to="/" className="flex items-center space-x-2">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                        {isSidebarOpen && <span className="font-bold text-xl text-white tracking-tight animate-in fade-in">GB-DMS</span>}
                    </Link>
                </div>

                <div className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
                    <Link to="/admin/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')}`}>
                        <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Dashboard</span>}
                    </Link>

                    <Link to="/admin/risk-assessment" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/risk-assessment')}`}>
                        <Activity className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Risk Assessment</span>}
                    </Link>

                    <Link to="/admin/live-map" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/live-map')}`}>
                        <Map className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Live Map</span>}
                    </Link>

                    <Link to="/admin/content" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/content')}`}>
                        <FileText className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Content Management</span>}
                    </Link>

                    <Link to="/admin/inventory" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/inventory')}`}>
                        <Package className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Inventory</span>}
                    </Link>

                    <Link to="/admin/reports" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/reports')}`}>
                        <FileText className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Reports</span>}
                    </Link>

                    <Link to="/admin/users" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')}`}>
                        <Users className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Users</span>}
                    </Link>
                </div>

                <div className="p-4 border-t border-slate-800 space-y-2 flex-shrink-0 bg-slate-900">
                    <Link to="/">
                        <Button variant="ghost" className={`w-full text-slate-400 hover:text-white hover:bg-slate-800 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
                            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                            {isSidebarOpen && <span className="ml-3 truncate">Back to App</span>}
                        </Button>
                    </Link>

                    <Button variant="ghost" onClick={() => logout()} className={`w-full text-slate-400 hover:text-red-500 hover:bg-slate-800 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="ml-3 truncate">Sign Out</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
                <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Menu className="h-6 w-6" />
                        </button>
                        {/* Mobile Logo in Header */}
                        <div className="md:hidden flex items-center gap-2">
                            <ShieldAlert className="h-6 w-6 text-red-600" />
                            <span className="font-bold text-lg text-slate-900">GB-DMS</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="hidden md:inline text-sm font-medium text-slate-600">{user?.name || "Admin"}</span>
                        <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                            {user?.name ? user.name[0].toUpperCase() : "A"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-[100vw]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
