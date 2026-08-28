import React, { useState } from 'react';
import { HiQuestionMarkCircle, HiMagnifyingGlass, HiCheckCircle, HiFunnel } from 'react-icons/hi2';

export const QuestionBankPage = () => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const questions = [
    { id: 'qb1', question: 'What is the sum of eigenvalues of a 3x3 matrix whose trace is 12?', subject: 'Mathematics', difficulty: 'Medium', type: 'Single Correct', tag: 'Linear Algebra' },
    { id: 'qb2', question: 'Calculate the de Broglie wavelength of an electron accelerated through 100V potential.', subject: 'Physics', difficulty: 'Easy', type: 'Numerical', tag: 'Modern Physics' },
    { id: 'qb3', question: 'Which reagent is used for the conversion of an acid chloride to an aldehyde (Rosenmund reduction)?', subject: 'Chemistry', difficulty: 'Medium', type: 'Single Correct', tag: 'Aldehydes & Ketones' },
    { id: 'qb4', question: 'Find the maximum value of f(x) = sin(x) + cos(x) on the interval [0, pi].', subject: 'Mathematics', difficulty: 'Easy', type: 'Single Correct', tag: 'Calculus' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Interactive Question Bank</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Search over 15,000+ curated conceptual problems with instant video and textual explanations</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by keyword or concept..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
        >
          <option value="All">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
        </select>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{q.subject}</span>
                <span className="text-[10px] text-gray-400">• {q.tag}</span>
              </div>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400">{q.difficulty}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{idx + 1}. {q.question}</h3>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400">{q.type}</span>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                Solve & View Solution
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBankPage;
