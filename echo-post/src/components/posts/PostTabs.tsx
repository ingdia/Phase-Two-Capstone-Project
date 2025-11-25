import React, { useCallback } from 'react';
import { TabType } from '@/types';

interface PostTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const PostTabs = React.memo(function PostTabs({ activeTab, onTabChange }: PostTabsProps) {
  const handleDraftsClick = useCallback(() => {
    onTabChange('DRAFTS');
  }, [onTabChange]);

  const handlePublishedClick = useCallback(() => {
    onTabChange('PUBLISHED');
  }, [onTabChange]);
  return (
    <div className="flex border-b border-gray-200 mb-8">
      <button
        className={`mr-6 pb-2 font-semibold text-lg ${
          activeTab === "DRAFTS"
            ? "text-gray-900 border-b-4 border-gray-900"
            : "text-gray-600"
        }`}
        onClick={handleDraftsClick}
      >
        Drafts
      </button>

      <button
        className={`pb-2 font-semibold text-lg ${
          activeTab === "PUBLISHED"
            ? "text-gray-900 border-b-4 border-gray-900"
            : "text-gray-600"
        }`}
        onClick={handlePublishedClick}
      >
        Published
      </button>
    </div>
  );
});

export default PostTabs;