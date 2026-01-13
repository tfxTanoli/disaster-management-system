import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Activity,
    Package,
    Bell,
    FileText,
    LogOut,
    ShieldAlert,
    Menu,
    Map,
    Users
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800";
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 min-h-screen transition-all duration-300 flex flex-col fixed md:relative z-30`}>
                <div className="h-16 flex items-center justify-center border-b border-slate-800">
                    <Link to="/" className="flex items-center space-x-2">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                        {isSidebarOpen && <span className="font-bold text-xl text-white tracking-tight animate-in fade-in">GB-DMS</span>}
                    </Link>
                </div>

                <div className="flex-1 py-6 space-y-2 px-3">
                    <Link to="/admin/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')}`}>
                        <LayoutDashboard className="h-5 w-5" />
                        {isSidebarOpen && <span>Dashboard</span>}
                    </Link>

                    <Link to="/admin/risk-assessment" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/risk-assessment')}`}>
                        <Activity className="h-5 w-5" />
                        {isSidebarOpen && <span>Risk Assessment</span>}
                    </Link>

                    <Link to="/admin/live-map" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/live-map')}`}>
                        <Map className="h-5 w-5" />
                        {isSidebarOpen && <span>Live Map</span>}
                    </Link>

                    <Link to="/admin/alerts" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/alerts')}`}>
                        <Bell className="h-5 w-5" />
                        {isSidebarOpen && <span>Alerts Manager</span>}
                    </Link>

                    <Link to="/admin/inventory" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/inventory')}`}>
                        <Package className="h-5 w-5" />
                        {isSidebarOpen && <span>Inventory</span>}
                    </Link>

                    <Link to="/admin/reports" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/reports')}`}>
                        <FileText className="h-5 w-5" />
                        {isSidebarOpen && <span>Reports</span>}
                    </Link>

                    <Link to="/admin/users" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')}`}>
                        <Users className="h-5 w-5" />
                        {isSidebarOpen && <span>Users</span>}
                    </Link>
                </div>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link to="/">
                        <Button variant="ghost" className={`w-full text-slate-400 hover:text-white hover:bg-slate-800 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
                            <ShieldAlert className="h-5 w-5" />
                            {isSidebarOpen && <span className="ml-3">Back to App</span>}
                        </Button>
                    </Link>

                    <Button variant="ghost" onClick={() => logout()} className={`w-full text-slate-400 hover:text-red-500 hover:bg-slate-800 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
                        <LogOut className="h-5 w-5" />
                        {isSidebarOpen && <span className="ml-3">Sign Out</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-600">{user?.name || "Admin"}</span>
                        <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                            {user?.name ? user.name[0].toUpperCase() : "A"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
