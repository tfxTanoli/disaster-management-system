import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    role: "admin" | "user" | "guest";
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: "admin" | "user") => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem("dms_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (role: "admin" | "user") => {
        const mockUser: User = role === "admin"
            ? { id: "1", name: "Admin Officer", role: "admin", email: "admin@gbdms.gov.pk" }
            : { id: "2", name: "Citizen", role: "user", email: "citizen@example.com" };

        setUser(mockUser);
        localStorage.setItem("dms_user", JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("dms_user");
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.role === "admin"
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
