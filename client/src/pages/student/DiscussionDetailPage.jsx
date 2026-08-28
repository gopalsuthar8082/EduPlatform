import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiHandThumbUp, HiPaperAirplane, HiChatBubbleLeftRight } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const DiscussionDetailPage = () => {
  const { id } = useParams();
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([
    { id: 1, author: 'Dr. Rajesh Sharma (Faculty)', content: 'I strongly recommend mastering Taylor and Maclaurin expansions for multi-correct calculus questions. It avoids 80% of lengthy algebra.', time: '2h ago', isFaculty: true },
    { id: 2, author: 'Aarav Patel', content: 'Thanks sir! That definitely saves critical exam time.', time: '1h ago', isFaculty: false }
  ]);

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplies((prev) => [
      ...prev,
      { id: Date.now(), author: 'You', content: reply.trim(), time: 'Just now', isFaculty: false }
    ]);
    setReply('');
    toast.success('Reply posted!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link to="/discussions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
        <HiArrowLeft className="h-4 w-4" /> Back to Discussions
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
        <span className="rounded bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Strategy</span>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Best strategy for solving multi-correct questions in JEE Advanced Calculus? (Discussion #{id})
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          I often get partial marks or negative marking because of one missed option in multi-correct calculus sections. What is the most reliable workflow to verify every single choice rigorously without spending more than 4 minutes per problem?
        </p>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Responses ({replies.length})</h3>
        {replies.map((r) => (
          <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${r.isFaculty ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                {r.author} {r.isFaculty && '★ Verified'}
              </span>
              <span className="text-[10px] text-gray-400">{r.time}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">{r.content}</p>
          </div>
        ))}
      </div>

      {/* Reply input */}
      <form onSubmit={handleAddReply} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3">
        <textarea
          rows={3}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a constructive response or follow up..."
          className="w-full rounded-xl border border-gray-200 p-3 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
            <HiPaperAirplane className="h-4 w-4" /> Post Reply
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiscussionDetailPage;
