import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="px-4 sm:px-6 py-3 flex gap-3 overflow-x-auto no-scrollbar flex-shrink-0 bg-white border-b border-gray-200">
      <button
        onClick={() => onTagSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
          !selectedTag
            ? "bg-gray-900 text-white shadow"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedTag === tag
              ? "bg-gray-900 text-white shadow"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}