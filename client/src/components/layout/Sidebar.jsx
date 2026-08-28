import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiSquares2X2,
  HiAcademicCap,
  HiBookOpen,
  HiPlayCircle,
  HiClipboardDocumentCheck,
  HiDocumentText,
  HiSparkles,
  HiChatBubbleLeftRight,
  HiChartBar,
  HiTrophy,
  HiUser,
  HiXMark,
  HiShieldCheck,
  HiQueueList,
  HiQuestionMarkCircle,
} from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth.js';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = ['admin', 'superadmin'].includes(user?.role);
  const isAdminRoute = location.pathname.startsWith('/admin');

  const studentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiSquares2X2 },
    { name: 'Courses', path: '/courses', icon: HiAcademicCap },
    { name: 'Materials', path: '/materials', icon: HiBookOpen },
    { name: 'Lectures', path: '/lectures', icon: HiPlayCircle },
    { name: 'Quizzes', path: '/quizzes', icon: HiClipboardDocumentCheck },
    { name: 'Question Bank', path: '/question-bank', icon: HiQuestionMarkCircle },
    { name: 'Question Papers', path: '/question-papers', icon: HiDocumentText },
    { name: 'CBT Test Series', path: '/tests', icon: HiSparkles },
    { name: 'Discussions', path: '/discussions', icon: HiChatBubbleLeftRight },
    { name: 'Polls', path: '/polls', icon: HiQueueList },
    { name: 'Performance', path: '/performance', icon: HiChartBar },
    { name: 'Leaderboard', path: '/leaderboard', icon: HiTrophy },
    { name: 'My Profile', path: '/profile', icon: HiUser },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: HiSquares2X2 },
    { name: 'Users Management', path: '/admin/users', icon: HiUser },
    { name: 'Courses Manager', path: '/admin/courses', icon: HiAcademicCap },
    { name: 'Subjects & Topics', path: '/admin/subjects', icon: HiBookOpen },
    { name: 'Study Materials', path: '/admin/materials', icon: HiDocumentText },
    { name: 'Lectures', path: '/admin/lectures', icon: HiPlayCircle },
    { name: 'Question Bank', path: '/admin/questions', icon: HiQuestionMarkCircle },
    { name: 'Question Papers', path: '/admin/question-papers', icon: HiDocumentText },
    { name: 'Quizzes', path: '/admin/quizzes', icon: HiClipboardDocumentCheck },
    { name: 'Tests & CBT', path: '/admin/tests', icon: HiSparkles },
    { name: 'Discussions', path: '/admin/discussions', icon: HiChatBubbleLeftRight },
    { name: 'Polls', path: '/admin/polls', icon: HiQueueList },
    { name: 'Announcements', path: '/admin/announcements', icon: HiDocumentText },
    { name: 'Roles & Permissions', path: '/admin/roles', icon: HiShieldCheck },
  ];

  const currentNavItems = isAdminRoute ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
          <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20">
              <HiAcademicCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                Edu<span className="text-indigo-600 dark:text-indigo-400">Platform</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Digital Learning
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher for Admins */}
        {isAdmin && (
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <NavLink
                to="/dashboard"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                    !isAdminRoute
                      ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                  }`
                }
              >
                Student
              </NavLink>
              <NavLink
                to="/admin/dashboard"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isAdminRoute
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                  }`
                }
              >
                Admin Panel
              </NavLink>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {isAdminRoute ? 'Admin Navigation' : 'Learning Portal'}
          </div>

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/dashboard' || item.path === '/admin/dashboard'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 dark:bg-indigo-600 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-gray-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Support Card */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 p-3.5 dark:from-indigo-950/40 dark:to-gray-850 border border-indigo-200/60 dark:border-indigo-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                AI Tutor Active
              </p>
            </div>
            <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-400">
              Need instant step-by-step help with problems?
            </p>
            <NavLink
              to="/question-bank"
              onClick={onClose}
              className="mt-2.5 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Ask Doubt / Practice
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
