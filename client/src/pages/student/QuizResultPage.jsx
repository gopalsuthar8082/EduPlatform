import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiTrophy, HiCheckCircle, HiXCircle, HiArrowLeft, HiArrowPath } from 'react-icons/hi2';

export const QuizResultPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <Link to="/quizzes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
        <HiArrowLeft className="h-4 w-4" /> Back to Quizzes
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-850 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <HiTrophy className="h-10 w-10 text-amber-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Quiz Completed!</h1>
        <p className="text-xs text-gray-500">Calculus: Limits & Indeterminate Forms Diagnostic</p>

        {/* Score Card */}
        <div className="grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <div>
            <p className="text-xs text-gray-400">Total Score</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">52 / 60</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Accuracy</p>
            <p className="text-xl font-bold text-emerald-600">86.7%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Time Taken</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">18m 24s</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Link to={`/quizzes/${id}`} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200">
            <HiArrowPath className="h-4 w-4" /> Re-attempt
          </Link>
          <Link to="/quizzes" className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700">
            Explore More Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
