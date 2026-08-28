import React, { useState } from 'react';
import { HiQueueList, HiCheckCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const PollListPage = () => {
  const [voted, setVoted] = useState({});

  const polls = [
    {
      id: 'p1',
      question: 'Which subject do you find most challenging in full syllabus mock tests?',
      options: [
        { text: 'Calculus & Vectors (Math)', votes: 420 },
        { text: 'Mechanics & Rotational Dynamics (Physics)', votes: 610 },
        { text: 'Organic Mechanisms & Synthesis (Chemistry)', votes: 530 },
        { text: 'Inorganic Chemistry & Coordination (Chemistry)', votes: 290 },
      ],
      totalVotes: 1850,
    },
    {
      id: 'p2',
      question: 'What is your preferred revision routine before a major exam?',
      options: [
        { text: 'Formula Cheat Sheets + PYQ Solving', votes: 890 },
        { text: 'Full Length 3-hour Timed CBT Mocks', votes: 720 },
        { text: 'Re-watching high-speed video lectures', votes: 310 },
      ],
      totalVotes: 1920,
    }
  ];

  const handleVote = (pollId, optIdx) => {
    setVoted((prev) => ({ ...prev, [pollId]: optIdx }));
    toast.success('Vote recorded!');
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Community Polls & Surveys</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Share your opinion and discover what top performers in your peer group are doing</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {polls.map((poll) => (
          <div key={poll.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{poll.question}</h3>
            <div className="space-y-2.5">
              {poll.options.map((opt, idx) => {
                const isSelected = voted[poll.id] === idx;
                const percentage = Math.round((opt.votes / poll.totalVotes) * 100);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleVote(poll.id, idx)}
                    className={`relative w-full overflow-hidden rounded-xl border p-3 text-xs text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 font-bold text-indigo-900 dark:text-indigo-200'
                        : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-950/60 pointer-events-none transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected && <HiCheckCircle className="h-4 w-4 text-indigo-600" />}
                        <span>{opt.text}</span>
                      </div>
                      <span className="font-semibold text-gray-500">{percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 text-right">{poll.totalVotes.toLocaleString()} total votes</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollListPage;
