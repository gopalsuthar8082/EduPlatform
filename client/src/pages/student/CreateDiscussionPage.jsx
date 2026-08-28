import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiPaperAirplane } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const CreateDiscussionPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Discussion');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter title and content');
      return;
    }
    toast.success('Discussion topic published successfully!');
    navigate('/discussions');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link to="/discussions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
        <HiArrowLeft className="h-4 w-4" /> Back to Discussions
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-6">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Create New Discussion Topic</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Discussion Title / Question
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to effectively approach tricky Rotation questions?"
              className="w-full rounded-xl border border-gray-200 p-3 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="General Discussion">General Discussion</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Exam Strategy">Exam Strategy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Detailed Description / Context
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain your thought process or what you need clarification on..."
              className="w-full rounded-xl border border-gray-200 p-3 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/discussions')}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
            >
              <HiPaperAirplane className="h-4 w-4" /> Publish Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussionPage;
