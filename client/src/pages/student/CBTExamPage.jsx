import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiClock, HiAcademicCap, HiBookmark, HiArrowRight, HiArrowLeft, HiCheckCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const CBTExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const subjects = ['Physics', 'Chemistry', 'Mathematics'];

  const questions = [
    {
      id: 'q1',
      subject: 'Mathematics',
      text: 'Find the area bounded by the curve y = x^2 and the line y = 4.',
      options: ['32/3 sq units', '16/3 sq units', '8 sq units', '64/3 sq units'],
      marks: 4,
      negMarks: -1,
    },
    {
      id: 'q2',
      subject: 'Mathematics',
      text: 'If matrix A satisfies A^2 - A + I = 0, then the inverse of A is equal to:',
      options: ['I - A', 'A - I', 'A + I', 'A^2'],
      marks: 4,
      negMarks: -1,
    },
    {
      id: 'q3',
      subject: 'Physics',
      text: 'A particle executes SHM with amplitude A. At what displacement from mean position is kinetic energy equal to potential energy?',
      options: ['A / sqrt(2)', 'A / 2', 'A / sqrt(3)', 'A / 4'],
      marks: 4,
      negMarks: -1,
    },
    {
      id: 'q4',
      subject: 'Chemistry',
      text: 'Which of the following compounds exhibits optical isomerism?',
      options: ['Lactic Acid', 'Acetic Acid', 'Formic Acid', 'Propionic Acid'],
      marks: 4,
      negMarks: -1,
    }
  ];

  const currentQ = questions[currentIdx] || questions[0];

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIdx];
      return copy;
    });
  };

  const handleMarkReview = () => {
    setMarkedForReview((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleSaveNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleSubmitExam = () => {
    toast.success('Exam successfully submitted!');
    navigate(`/tests/${id}/result`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 select-none">
      {/* CBT Header */}
      <header className="flex h-14 items-center justify-between border-b border-gray-300 bg-gray-900 px-4 sm:px-6 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
            <HiAcademicCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight">CBT EXAM PORTAL: TEST #{id}</h1>
            <p className="text-[10px] text-gray-400">National Mock Exam Standard Environment</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-1 text-xs font-mono font-bold text-amber-400 border border-gray-700">
            <HiClock className="h-4 w-4" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={handleSubmitExam}
            className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Subject Tabs */}
      <div className="flex border-b border-gray-300 bg-white px-4 dark:border-gray-800 dark:bg-gray-850">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeSubject === sub
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Exam Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Question Area (8 cols) */}
        <div className="lg:col-span-9 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Question No. {currentIdx + 1}
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-emerald-600">Marks: +{currentQ.marks}</span>
                <span className="text-red-500">Negative: {currentQ.negMarks}</span>
              </div>
            </div>

            <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
              {currentQ.text}
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(i)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-xs text-left transition-all ${
                    answers[currentIdx] === i
                      ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200'
                      : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 font-bold text-[10px]">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkReview}
                className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300"
              >
                {markedForReview[currentIdx] ? 'Unmark Review' : 'Mark for Review & Next'}
              </button>
              <button
                onClick={handleClearResponse}
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => i - 1)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                Previous
              </button>
              <button
                onClick={handleSaveNext}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Question Palette (3 cols) */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-850 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Question Palette</h3>

          {/* Palette Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded bg-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded bg-amber-500" />
              <span>Marked Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded bg-gray-200 dark:bg-gray-700" />
              <span>Not Visited</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            {questions.map((_, idx) => {
              const isAns = answers[idx] !== undefined;
              const isRev = markedForReview[idx];
              let bg = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
              if (isAns) bg = 'bg-emerald-500 text-white';
              if (isRev) bg = 'bg-amber-500 text-white';
              if (idx === currentIdx) bg += ' ring-2 ring-indigo-600 font-black';

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-9 rounded-lg text-xs font-bold transition-all ${bg}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-6">
            <button
              onClick={handleSubmitExam}
              className="w-full rounded-xl bg-red-600 py-3 text-xs font-bold text-white shadow-md hover:bg-red-700"
            >
              Submit Full Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBTExamPage;
