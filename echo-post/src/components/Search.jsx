import { Search as SearchIcon } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-2.5 h-5 w-5" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-full bg-white border border-gray-200 py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none"
        />
      </div>
    </div>
  );
}
