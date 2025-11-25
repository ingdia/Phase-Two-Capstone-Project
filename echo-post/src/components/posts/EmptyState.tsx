import React from 'react';
import Link from 'next/link';
import { TabType } from '@/types';

interface EmptyStateProps {
  activeTab: TabType;
}

export default function EmptyState({ activeTab }: EmptyStateProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        No {activeTab === "DRAFTS" ? "Drafts" : "Published Posts"} Found
      </h2>
      <Link
        href="/dashboard/createPost"
        className="text-white bg-pink-900 px-4 py-2 rounded-xl hover:bg-pink-800 inline-block transition"
      >
        Create a Post
      </Link>
    </div>
  );
}