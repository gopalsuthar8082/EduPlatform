import React from 'react';
import { HiQuestionMarkCircle, HiPlus } from 'react-icons/hi2';

export const AdminQuestionsPage = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Question Bank Admin</h1>
          <p className="text-xs text-gray-500">Create MCQs, numericals, and multi-correct questions with solutions</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
          <HiPlus className="h-4 w-4" /> Add Problem
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <p className="text-xs text-gray-500">Manage pool of 15,000+ problems, answer keys, and LaTeX math formatting.</p>
      </div>
    </div>
  );
};

export default AdminQuestionsPage;
