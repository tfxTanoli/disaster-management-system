import { Home, Bell, MapPin, Box, Settings, LogOut, ShieldAlert } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" }, // Fixed root href
    { icon: Bell, label: "Content & Alerts", href: "/admin/content" },
    { icon: MapPin, label: "Live Map", href: "/admin/live-map" }, // Fixed root href
    { icon: Box, label: "Inventory", href: "/admin/inventory" }, // Fixed root href
    { icon: Settings, label: "Users", href: "/admin/users" }, // Replaced Settings with Users as per App.tsx routes
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-900 text-white shadow-xl">
            <div className="flex h-16 items-center px-6 border-b border-slate-800">
                <ShieldAlert className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-lg font-bold">GB-DMS</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-slate-800 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center space-x-3 mb-4 px-3">
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                        JD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-white">John Doe</p>
                        <p className="truncate text-xs text-slate-400">Admin</p>
                    </div>
                </div>
                <button className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
