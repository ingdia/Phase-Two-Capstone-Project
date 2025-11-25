"use client";

import Link from "next/link";
import {
  Home,
  PenSquare,
  FileText,
  BarChart2,
  Bookmark,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MediumSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const displayName = user?.name || user?.username || "User";
  const displayUsername = user?.username || user?.email?.split("@")[0] || "@user";
  const avatarInitials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      router.push("/login");
    }
  };
  const menu = [
    { name: "Home", icon: Home, link: "/dashboard/overview" },
    { name: "Write a Story", icon: PenSquare, link: "/dashboard/createPost" },
    { name: "My Post", icon: FileText, link: "/dashboard/mypost" },
    { name: "Explore", icon: FileText, link: "/dashboard/explore" },

  ];

  const accountMenu = [
    { name: "Profile", icon: User, link: "/dashboard/profile" },
  ];

  return (
    <aside className="h-screen w-[260px] hidden font-serif md:flex flex-col bg-white border-r shadow-sm fixed left-0 top-0 p-4 lg:p-6 z-40">
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-gray-900 mb-6 lg:mb-10">
        Echo Post
      </h1>

      {/* New Story Button */}
      <Link href="/dashboard/createPost">
        <button className="w-full bg-black text-white py-2.5 lg:py-3 rounded-full font-medium text-sm mb-6 lg:mb-8 hover:bg-gray-800 transition">
          + New Story
        </button>
      </Link>

      {/* Main Menu */}
      <div className="flex flex-col gap-3">
        <p className="text-gray-400 text-xs tracking-wide pl-2">MENU</p>

        {menu.map((item, i) => (
          <Link href={item.link} key={i}>
            <div className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 hover:translate-x-1 transition-all cursor-pointer">
              <item.icon size={22} className="text-gray-700" />
              <span className="text-gray-800 font-medium">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Account Menu */}
      <div className="mt-10 flex flex-col gap-3">
        <p className="text-gray-400 text-xs tracking-wide pl-2">ACCOUNT</p>

        {accountMenu.map((item, i) => (
          <Link href={item.link} key={i}>
            <div className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 hover:translate-x-1 transition-all cursor-pointer">
              <item.icon size={22} className="text-gray-700" />
              <span className="text-gray-800 font-medium">{item.name}</span>
            </div>
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer text-gray-800 font-medium"
        >
          <LogOut size={22} className="text-gray-700" />
          <span>Logout</span>
        </button>
      </div>

    
      <div className="mt-auto flex items-center gap-3 border-t pt-5">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
            {avatarInitials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{displayUsername}</p>
        </div>
      </div>
    </aside>
  );
}
