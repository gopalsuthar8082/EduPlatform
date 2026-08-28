import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiDocumentText, HiArrowDownTray, HiPrinter } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const QuestionPaperViewPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link to="/question-papers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
          <HiArrowLeft className="h-4 w-4" /> Back to Question Papers
        </Link>
        <button onClick={() => toast.success('Downloading Paper...')} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700">
          <HiArrowDownTray className="h-4 w-4" /> Download PDF
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Question Paper & Solution Key #{id}
        </h1>
        <div className="min-h-[450px] w-full rounded-xl bg-gray-50 dark:bg-gray-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
          <HiDocumentText className="h-14 w-14 text-indigo-500 opacity-70" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Official Exam Paper Sheet</h3>
          <p className="text-xs text-gray-400 max-w-sm">Section-wise questions with answer keys and verified marking schemes.</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperViewPage;
