"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dash/Sidebar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

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
    <>
      <Sidebar />
      <div className=" ml-58 px-6 bg-white">
        {children}
        <Footer />
      </div>
    </>
  );
}
