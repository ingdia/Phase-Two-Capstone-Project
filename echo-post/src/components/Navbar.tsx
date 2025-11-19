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
    <header className="w-full border-b bg-white font-serif shadow-sm">
      
      {/* Top bar */}
      <div className="bg-gray-100 flex justify-between items-center px-4 py-2 text-sm text-gray-600">
        <div className="text-pink-600">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="space-x-2 font-semibold">
          <Link href="/login" className="hover:underline border-r-2 px-2 border-gray-300">Sign In</Link>
          <Link href="/register" className="hover:underline">Sign Up</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-3 space-y-2 md:space-y-0">
        <div className={`${playfair.className} italic text-2xl font-semibold text-black`}>
          Echo Post
        </div>

        
        <div className="w-full max-w-md">
          <SearchBar />
        </div>

        
        <nav className="flex space-x-6 items-center text-gray-800 text-sm font-medium">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/community" className="hover:text-black">Community</Link>
          <Link 
            href="/write" 
            className="bg-pink-600 text-white px-4 py-1 rounded-full hover:bg-gray-800"
          >
            Write
          </Link>
        </nav>
      </div>

    </header>
  );
}

export default Navbar;
