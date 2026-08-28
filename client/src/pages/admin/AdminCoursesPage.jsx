import React from 'react';
import { HiAcademicCap, HiPlus } from 'react-icons/hi2';

export const AdminCoursesPage = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Courses Management</h1>
          <p className="text-xs text-gray-500">Create, edit, and publish digital courses and study tracks</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm">
          <HiPlus className="h-4 w-4" /> Add New Course
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage all courses and course curricula across the platform.</p>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
