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
    <header className="w-full border-b bg-white font-serif">
      {/* Top bar */}
      <div className="bg-pink-900 flex justify-between items-center px-4 py-2 text-sm">
        <div>
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="space-x-4 font-bold ">
          <Link href="/Sign In">
            <button className="border-r px-3">Sign In</button>
          </Link>
          <Link href="/Sign In">
            <button>Sign Up</button>
          </Link>
        </div>
      </div>

      {/* buttom  bar */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-3 text-pink-900 font-bold space-y-2 md:space-y-0">
        <div className={` ${playfair.className} italic text-xl font-semibold `}>
          Echo Post
        </div>

        <div className="hover:bg-pink-100 p-2 rounded-full ">
          <SearchBar />
        </div>

        <nav className="space-x-6 text-sm">
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <Link href="/community" className="hover:text-pink-600">
            Community
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
