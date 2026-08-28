import React from 'react';
import { HiMegaphone, HiPlus } from 'react-icons/hi2';

export const AdminAnnouncementsPage = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Platform Announcements</h1>
          <p className="text-xs text-gray-500">Publish news, mock exam schedules, and system alerts to all learners</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
          <HiPlus className="h-4 w-4" /> Broadcast Announcement
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <p className="text-xs text-gray-500">Broadcast high-priority notices, updates, and schedule notifications.</p>
      </div>
    </div>
  );
};

export default AdminAnnouncementsPage;
