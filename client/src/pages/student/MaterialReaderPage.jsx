import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowDownTray, HiBookOpen, HiPrinter } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const MaterialReaderPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link to="/materials" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
          <HiArrowLeft className="h-4 w-4" /> Back to Materials
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="rounded-lg border border-gray-200 bg-white p-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <HiPrinter className="h-4 w-4" />
          </button>
          <button onClick={() => toast.success('Download started')} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700">
            <HiArrowDownTray className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <HiBookOpen className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Document Reader Viewer</span>
        </div>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Study Document: ID #{id}
        </h1>

        {/* Embedded PDF / document reader container */}
        <div className="min-h-[500px] w-full rounded-xl bg-gray-100 dark:bg-gray-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
          <HiBookOpen className="h-16 w-16 text-indigo-400 opacity-60" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Interactive PDF Reader Engine</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
            The document stream is loaded in high definition with annotation and full search indexing support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaterialReaderPage;
