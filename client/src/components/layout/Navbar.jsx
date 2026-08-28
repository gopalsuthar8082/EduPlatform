import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiBars3,
  HiBell,
  HiSun,
  HiMoon,
  HiArrowRightOnRectangle,
  HiUserCircle,
  HiAcademicCap,
  HiMagnifyingGlass,
  HiShieldCheck,
} from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'New Quiz Added',
      desc: 'Differential Equations Quiz 2 is now available.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Streak Milestone!',
      desc: 'You reached a 14-day study streak. Keep it up! 🔥',
      time: '2h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Mega Mock Test Scheduled',
      desc: 'All India Test is scheduled for tomorrow at 10 AM.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 lg:px-8">
      {/* Left side: Hamburger button + Search */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <HiBars3 className="h-6 w-6" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <HiMagnifyingGlass className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses, lectures, quizzes..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:bg-gray-800"
          />
        </div>
      </div>

      {/* Right side: Streak, Dark Mode, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Study Streak Badge */}
        {user && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50">
            <span>🔥</span>
            <span>{user.streak || 14} Day Streak</span>
          </div>
        )}

        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          aria-label="Toggle dark mode"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <HiMoon className="h-5 w-5" />
          ) : (
            <HiSun className="h-5 w-5 text-amber-400" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
            aria-label="View notifications"
          >
            <HiBell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
            </span>
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-850 z-50">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                  2 new
                </span>
              </div>
              <div className="max-h-72 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer ${
                      notif.unread ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-gray-400">{notif.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {notif.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 p-2 text-center dark:border-gray-800">
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 transition-colors"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-indigo-100 ring-2 ring-indigo-600/20 dark:bg-indigo-900">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {user?.name || 'Student'}
              </p>
              <p className="text-[11px] capitalize text-gray-500 dark:text-gray-400">
                {user?.role || 'student'}
              </p>
            </div>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-850 z-50">
              <div className="border-b border-gray-100 px-4 py-2.5 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'Student'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'student@eduplatform.com'}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <HiShieldCheck className="h-3 w-3" />
                  {user?.role?.toUpperCase() || 'STUDENT'}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                >
                  <HiUserCircle className="h-4 w-4" />
                  My Profile & Settings
                </Link>

                <Link
                  to="/performance"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                >
                  <HiAcademicCap className="h-4 w-4" />
                  Performance Analytics
                </Link>

                {['admin', 'superadmin'].includes(user?.role) && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                  >
                    <HiShieldCheck className="h-4 w-4" />
                    Admin Control Panel
                  </Link>
                )}
              </div>

              <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <HiArrowRightOnRectangle className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
