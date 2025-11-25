"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryClientProvider } from '@tanstack/react-query';
import Sidebar from "@/components/dash/Sidebar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { queryClient } from '@/lib/queryClient';

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [initializing, isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        Checking authentication... make sure you are logedIn
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
      <div className="md:ml-[260px] px-4 sm:px-6 bg-white min-h-screen">
        {children}
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
