import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiClipboardDocumentCheck, HiMagnifyingGlass, HiClock, HiTrophy } from 'react-icons/hi2';

export const QuizListPage = () => {
  const [search, setSearch] = useState('');

  const quizzes = [
    { id: 'quiz1', title: 'Calculus: Limits & Indeterminate Forms Diagnostic', subject: 'Mathematics', questions: 15, duration: 30, marks: 60, status: 'Attempted', score: '52/60' },
    { id: 'quiz2', title: 'Newton\'s Laws of Motion & Friction Assessment', subject: 'Physics', questions: 20, duration: 40, marks: 80, status: 'Not Attempted', score: '-' },
    { id: 'quiz3', title: 'Organic Chemistry: IUPAC & Stereochemistry Quiz', subject: 'Chemistry', questions: 15, duration: 30, marks: 60, status: 'Not Attempted', score: '-' },
    { id: 'quiz4', title: 'Calculus: Applications of Derivatives (Maxima/Minima)', subject: 'Mathematics', questions: 18, duration: 35, marks: 72, status: 'Attempted', score: '64/72' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Topic Quizzes</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Timed assessments to evaluate your speed and accuracy across topics</p>
      </div>

      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes by title or subject..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quizzes.map((q) => (
          <div key={q.id} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{q.subject}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${q.status === 'Attempted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>{q.status}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{q.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{q.questions} Questions • {q.duration} Mins • {q.marks} Marks</p>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              {q.status === 'Attempted' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Score: <strong className="text-indigo-600 dark:text-indigo-400">{q.score}</strong></span>
                  <Link to={`/quizzes/${q.id}/result`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Analysis</Link>
                </div>
              ) : <div />}
              <Link to={`/quizzes/${q.id}`} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700">
                {q.status === 'Attempted' ? 'Re-attempt' : 'Start Quiz'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizListPage;
