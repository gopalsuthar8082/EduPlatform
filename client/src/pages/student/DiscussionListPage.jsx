import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiChatBubbleLeftRight, HiPlus, HiHandThumbUp, HiMagnifyingGlass } from 'react-icons/hi2';

export const DiscussionListPage = () => {
  const [search, setSearch] = useState('');

  const discussions = [
    { id: 'd1', title: 'Best strategy for solving multi-correct questions in JEE Advanced Calculus?', author: 'Aarav Patel', category: 'Strategy', upvotes: 34, replies: 12, time: '3h ago' },
    { id: 'd2', title: 'How to master organic reaction mechanisms without rote memorization?', author: 'Sanya Verma', category: 'Chemistry', upvotes: 56, replies: 28, time: '1d ago' },
    { id: 'd3', title: 'Recommended reference books for Electromagnetism & Modern Physics', author: 'Rohan Gupta', category: 'Physics', upvotes: 21, replies: 9, time: '2d ago' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Community Discussion Forum</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ask doubts, share study resources, and discuss problem solving strategies with peers</p>
        </div>
        <Link to="/discussions/create" className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm self-start">
          <HiPlus className="h-4 w-4" /> Start New Discussion
        </Link>
      </div>

      <div className="space-y-4">
        {discussions.map((d) => (
          <div key={d.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{d.category}</span>
              <span className="text-xs text-gray-400">{d.time}</span>
            </div>
            <Link to={`/discussions/${d.id}`} className="block text-sm font-bold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
              {d.title}
            </Link>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>By {d.author}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><HiHandThumbUp className="h-4 w-4" /> {d.upvotes}</span>
                <span className="flex items-center gap-1"><HiChatBubbleLeftRight className="h-4 w-4" /> {d.replies} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionListPage;
