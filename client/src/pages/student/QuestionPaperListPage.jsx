import React from 'react';
import { Link } from 'react-router-dom';
import { HiDocumentText, HiArrowDownTray, HiEye, HiSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const QuestionPaperListPage = () => {
  const papers = [
    { id: 'qp1', title: 'JEE Advanced 2025 Paper 1 (Physics, Chemistry, Math)', year: '2025', duration: '180 Mins', totalMarks: 180, format: 'Official Pattern' },
    { id: 'qp2', title: 'JEE Advanced 2025 Paper 2 (Physics, Chemistry, Math)', year: '2025', duration: '180 Mins', totalMarks: 180, format: 'Official Pattern' },
    { id: 'qp3', title: 'NEET UG 2025 Complete Full Length Question Paper with Answer Key', year: '2025', duration: '200 Mins', totalMarks: 720, format: 'National Pattern' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Previous Year Question Papers (PYQs)</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Authentic previous years question papers with detailed step-by-step answer keys</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {papers.map((p) => (
          <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{p.year} Exam Paper</span>
              <span className="text-[11px] text-gray-400">{p.duration} • {p.totalMarks} Marks</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{p.title}</h3>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link to={`/question-papers/${p.id}`} className="flex-1 rounded-xl border border-gray-200 py-2 text-center text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200">
                View Solutions
              </Link>
              <button onClick={() => toast.success('Paper downloaded')} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
                <HiArrowDownTray className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionPaperListPage;
