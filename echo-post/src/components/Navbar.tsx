import React from "react";
import SearchBar from "./Search";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

function Navbar() {
  return (
    <header className="w-full bg-white font-serif shadow-lg border-b border-gray-200 sticky top-0 z-50">
      
      {/* Top bar */}
      <div className="bg-gray-100 flex justify-between items-center px-6 py-2 text-sm">
        <div className="flex items-center space-x-4">
          <div className="text-gray-700 font-medium">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-300"></div>
          <div className="hidden md:block text-gray-600 text-xs">
            Welcome to Echo Post
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-black font-medium px-3 py-1 rounded-md hover:bg-white transition-all duration-200"
          >
            Sign In
          </Link>
          <div className="w-px h-4 bg-gray-300"></div>
          <Link 
            href="/register" 
            className="text-black hover:text-gray-600 font-semibold px-3 py-1 rounded-md hover:bg-white transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Main navbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center px-6 py-4 space-y-4 lg:space-y-0">
        {/* Logo */}
        <Link href="/" className={`${playfair.className} text-2xl font-bold text-black hover:text-gray-600 transition-colors duration-200`}>
          <span className="italic">Echo</span>
          <span className="text-gray-600">Post</span>
        </Link>

        {/* Search Bar */}
        <div className="w-full max-w-lg lg:max-w-md">
          <SearchBar />
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
          </Link>
          <Link 
            href="/explore" 
            className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group"
          >
            Explore
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
          </Link>
          <Link 
            href="/login" 
            className="bg-black text-white font-medium px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-200"
          >
            Write
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
