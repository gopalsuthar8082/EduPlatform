import React from 'react';
import { Link } from 'react-router-dom';
import { HiExclamationTriangle, HiArrowLeft } from 'react-icons/hi2';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/50">
          <HiExclamationTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md"
          >
            <HiArrowLeft className="h-4 w-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
