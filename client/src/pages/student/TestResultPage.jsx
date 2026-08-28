import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiTrophy, HiChartBar, HiArrowLeft, HiSparkles } from 'react-icons/hi2';

export const TestResultPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link to="/tests" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
        <HiArrowLeft className="h-4 w-4" /> Back to Test Series
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <HiTrophy className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Exam Scorecard & Analysis</h1>
          <p className="text-xs text-gray-500">All India Mega Mock Test #{id}</p>
        </div>

        {/* High level stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-indigo-50/70 p-4 dark:bg-indigo-950/40 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Marks</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">248 / 300</p>
          </div>
          <div className="rounded-xl bg-emerald-50/70 p-4 dark:bg-emerald-950/40 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Percentile</p>
            <p className="text-2xl font-black text-emerald-600">99.4%</p>
          </div>
          <div className="rounded-xl bg-amber-50/70 p-4 dark:bg-amber-950/40 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">All India Rank</p>
            <p className="text-2xl font-black text-amber-600">AIR 24</p>
          </div>
          <div className="rounded-xl bg-blue-50/70 p-4 dark:bg-blue-950/40 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
            <p className="text-2xl font-black text-blue-600">88.5%</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-3">
          <Link to="/performance" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700">
            View In-depth Subject Analytics
          </Link>
          <Link to="/leaderboard" className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200">
            Check National Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
