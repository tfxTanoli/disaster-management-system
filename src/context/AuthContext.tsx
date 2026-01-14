import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface UserData {
    id: string;
    email: string | null;
    name: string | null;
    role: "admin" | "user";
    subscriptionStatus?: "basic" | "premium" | "organization";
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isPremium: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    isAuthenticated: false,
    isAdmin: false,
    isPremium: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchUserProfile(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchUserProfile(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (session: Session | null) => {
        if (session?.user) {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error || !data) {
                    // Fallback or handle missing profile
                    // Note: You might want to create a profile on the fly if it doesn't exist,
                    // or rely on a trigger to create it on signup.
                    // For now, we will use metadata or defaults.
                    console.warn("User profile missing, using defaults", error);
                    setUser({
                        id: session.user.id,
                        email: session.user.email ?? null,
                        name: session.user.user_metadata?.full_name || "User",
                        role: "user",
                        subscriptionStatus: "basic"
                    });
                } else {
                    setUser({
                        id: session.user.id,
                        email: session.user.email ?? null,
                        name: data.name || session.user.user_metadata?.full_name || "User",
                        role: data.role || "user",
                        subscriptionStatus: data.subscription_status || "basic" // Mapping 'subscription_status' from DB convention
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? null,
                    name: "User",
                    role: "user",
                    subscriptionStatus: "basic"
                });
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.role === "admin",
            isPremium: user?.subscriptionStatus === "premium" || user?.subscriptionStatus === "organization" || user?.role === "admin"
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

