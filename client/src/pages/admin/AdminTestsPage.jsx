import React from 'react';
import { HiSparkles, HiPlus } from 'react-icons/hi2';

export const AdminTestsPage = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin CBT Tests & Exam Series</h1>
          <p className="text-xs text-gray-500">Design full-length national CBT tests and configure proctoring settings</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
          <HiPlus className="h-4 w-4" /> Schedule New Test
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <p className="text-xs text-gray-500">Manage all CBT simulated exams and calculate percentile distributions.</p>
      </div>
    </div>
  );
};

export default AdminTestsPage;
