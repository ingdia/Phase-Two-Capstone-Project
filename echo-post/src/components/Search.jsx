"use client";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative group">
        <SearchIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
          isFocused ? 'text-black' : 'text-gray-400'
        }`} />

        <input
          type="text"
          placeholder="Search stories, authors..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full rounded-full bg-gray-50 border border-gray-200 py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:bg-white focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all duration-200 hover:bg-white"
        />
      </div>
    </div>
  );
}
