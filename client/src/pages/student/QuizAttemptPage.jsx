import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiClock, HiCheckCircle, HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const QuizAttemptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const questions = [
    {
      id: 'q1',
      question: 'Evaluate the limit as x -> 0 of (sin(3x) - 3x + 9x^3/2) / x^5.',
      options: ['81/40', '27/40', '9/20', '0'],
      marks: 4,
    },
    {
      id: 'q2',
      question: 'Find the value of lim x->0 (1 + 2x)^(1/x).',
      options: ['e', 'e^2', 'e^3', '1'],
      marks: 4,
    },
    {
      id: 'q3',
      question: 'If f(x) = |x - 1| + |x - 2|, then f(x) is non-differentiable at how many points?',
      options: ['0', '1', '2', 'Infinite'],
      marks: 4,
    },
  ];

  const currentQ = questions[currentIdx];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOption = (optIdx) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    toast.success('Quiz submitted successfully!');
    navigate(`/quizzes/${id}/result`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Quiz Top Header */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <div>
          <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Diagnostic Quiz #{id}</span>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Calculus: Limits & Indeterminate Forms</h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
          <HiClock className="h-4 w-4" />
          <span>{formatTime(timeLeft)} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Question Panel */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-500">Question {currentIdx + 1} of {questions.length}</span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">+{currentQ.marks} Marks</span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {currentQ.question}
          </p>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleOption(i)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-xs text-left transition-colors cursor-pointer ${
                  answers[currentIdx] === i
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold dark:bg-indigo-950/60 dark:text-indigo-200'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-[10px] font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200"
            >
              <HiArrowLeft className="h-4 w-4" /> Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((i) => i + 1)}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Next <HiArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Question Palette</h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-9 w-full rounded-lg text-xs font-bold transition-all ${
                  currentIdx === i
                    ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white'
                    : answers[i] !== undefined
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmitQuiz}
            className="w-full mt-4 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
          >
            End Test & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptPage;
