import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, database } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";

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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch user role and subscription from Realtime DB
                try {
                    const userRef = ref(database, `users/${firebaseUser.uid}`);
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: data.name || firebaseUser.displayName,
                            role: data.role || "user",
                            subscriptionStatus: data.subscriptionStatus || "basic"
                        });
                    } else {
                        // Fallback purely on Auth (shouldn't happen for reg users)
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: firebaseUser.displayName,
                            role: "user",
                            subscriptionStatus: "basic"
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Fallback to basic auth user
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || "User",
                        role: "user",
                        subscriptionStatus: "basic"
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
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

