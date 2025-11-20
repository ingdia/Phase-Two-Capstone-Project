"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
  stats?: {
    published: number;
    drafts: number;
    followers: number;
    following: number;
    likes: number;
  };
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  initializing: boolean;
  isAuthenticated: boolean;
  isFirstTime: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch("/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        const profileUser = data.user;
        setUser(profileUser);
        localStorage.setItem("user", JSON.stringify(profileUser));
      } else if (res.status === 401) {
        // Token invalid, clear auth
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);
          
          // If we have stored user, set it immediately for fast UI
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Then fetch fresh profile data
          await fetchProfile(storedToken);
        }
      } catch (error) {
        console.warn("Failed to restore auth state", error);
      } finally {
        setInitializing(false);
      }
    };

    loadAuth();
  }, []);

  const handleLogin = (nextUser: AuthUser, nextToken: string) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    
    // Fetch full profile after login
    fetchProfile(nextToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const handleRefreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(user && token),
      isFirstTime: Boolean(user && !user.bio),
      login: handleLogin,
      logout: handleLogout,
      refreshProfile: handleRefreshProfile,
    }),
    [token, user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

