import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiSparkles, HiShieldExclamation, HiCheckCircle } from 'react-icons/hi2';

export const TestInstructionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link to="/tests" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
        <HiArrowLeft className="h-4 w-4" /> Back to Test Series
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <HiSparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
              CBT Exam Instructions & Rules
            </h1>
            <p className="text-xs text-gray-500">Test ID: #{id} • 180 Minutes • 300 Marks</p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/50 flex items-start gap-3">
          <HiShieldExclamation className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-300 space-y-1">
            <p className="font-bold">Important Notice</p>
            <p>Once you click "Start CBT Exam", full-screen mode will be initiated. Leaving the browser window or switching tabs may lead to automatic test submission.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Exam Scheme & Marking</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Total Duration is <strong>180 minutes</strong>. A countdown timer will be visible at all times.</li>
            <li><strong>+4 marks</strong> awarded for every correct answer.</li>
            <li><strong>-1 mark</strong> deducted for every incorrect attempt in single-choice questions.</li>
            <li>You can mark questions for review and return to them anytime before time expires.</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex items-center">
            <input
              id="cbtAgree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="cbtAgree" className="ml-2 text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">
              I have read and understood all the above instructions and agree to the exam conditions.
            </label>
          </div>

          <button
            disabled={!agreed}
            onClick={() => navigate(`/tests/${id}/exam`)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            <HiSparkles className="h-5 w-5" />
            <span>Launch CBT Exam Environment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstructionPage;
