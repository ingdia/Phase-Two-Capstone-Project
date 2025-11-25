import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = "w-full sm:w-80"
}: SearchBarProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${className} px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-gray-900 bg-white`}
    />
  );
}