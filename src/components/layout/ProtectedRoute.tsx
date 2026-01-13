import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    allowedRoles?: ("admin" | "user")[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
                    <p className="text-slate-500 font-medium">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect guest to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect unauthorized user (e.g. user trying to access admin)
        // If they are admin, they can go anywhere users can, usually.
        // But for strict admin routes:
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
