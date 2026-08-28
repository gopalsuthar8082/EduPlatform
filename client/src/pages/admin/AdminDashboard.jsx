import React from 'react';
import {
  HiSquares2X2,
  HiUserGroup,
  HiAcademicCap,
  HiDocumentText,
  HiSparkles,
  HiArrowTrendingUp,
} from 'react-icons/hi2';
import StatCard from '../../components/common/StatCard.jsx';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Control Center</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Overview of platform metrics, student enrollments, exam series, and content management</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Registered Students" value="14,250" trend="+12% this month" icon={HiUserGroup} />
        <StatCard title="Active Courses" value="28" trend="+3 new" icon={HiAcademicCap} />
        <StatCard title="Question Bank Bank" value="15,400" trend="+450 added" icon={HiDocumentText} />
        <StatCard title="CBT Tests Conducted" value="890" trend="+88 this week" icon={HiSparkles} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Platform Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-bold text-center">
          <a href="/admin/courses" className="rounded-xl border border-gray-200 p-4 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-200 transition-colors">
            + Create New Course
          </a>
          <a href="/admin/questions" className="rounded-xl border border-gray-200 p-4 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-200 transition-colors">
            + Add Question Bank Item
          </a>
          <a href="/admin/tests" className="rounded-xl border border-gray-200 p-4 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-200 transition-colors">
            + Schedule Mock Test
          </a>
          <a href="/admin/announcements" className="rounded-xl border border-gray-200 p-4 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-200 transition-colors">
            + Post Announcement
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
