import React from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

export const AdminDiscussionsPage = () => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Discussions Moderation</h1>
        <p className="text-xs text-gray-500">Moderate student comments, answer queries, and pin verified solutions</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <p className="text-xs text-gray-500">Community forums moderation and spam control center.</p>
      </div>
    </div>
  );
};

export default AdminDiscussionsPage;
