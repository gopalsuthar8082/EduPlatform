import React from 'react';
import { Link } from 'react-router-dom';
import { HiSparkles, HiClock, HiAcademicCap, HiCalendarDays } from 'react-icons/hi2';

export const TestListPage = () => {
  const tests = [
    {
      id: 'test1',
      title: 'All India Mega Mock Test: JEE Advanced Physics & Math',
      date: 'Tomorrow, 10:00 AM',
      duration: '180 Mins',
      questions: 75,
      marks: 300,
      badge: 'National Rank Test',
      registeredCount: 4200,
    },
    {
      id: 'test2',
      title: 'NEET UG Full Syllabus Mock Test Series #4',
      date: 'Aug 31, 2:00 PM',
      duration: '200 Mins',
      questions: 200,
      marks: 720,
      badge: 'CBT Proctored',
      registeredCount: 8900,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Computer Based Test (CBT) Series</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Exact real-time exam simulations with percentile benchmarking and national rank predictions</p>
      </div>

      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="rounded bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 self-start">
                {test.badge}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <HiCalendarDays className="h-4 w-4" /> {test.date}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {test.title}
            </h2>

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <span>{test.duration} Duration</span>
              <span>•</span>
              <span>{test.questions} Questions</span>
              <span>•</span>
              <span>{test.marks} Total Marks</span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{test.registeredCount.toLocaleString()} Students Enrolled</span>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <Link
                to={`/tests/${test.id}/instructions`}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
              >
                <span>Read Instructions & Enter Exam</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestListPage;
