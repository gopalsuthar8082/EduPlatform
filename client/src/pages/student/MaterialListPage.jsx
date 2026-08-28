import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBookOpen, HiMagnifyingGlass, HiArrowDownTray, HiEye, HiSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const MaterialListPage = () => {
  const [search, setSearch] = useState('');

  const materials = [
    { id: 'mat1', title: 'Calculus: Complete Limits & Derivatives Formula Book', subject: 'Mathematics', size: '4.2 MB', pages: 28, downloads: 1420 },
    { id: 'mat2', title: 'Rotational Motion & Inertia High-Yield Cheat Sheet', subject: 'Physics', size: '2.1 MB', pages: 12, downloads: 980 },
    { id: 'mat3', title: 'Organic Reaction Mechanisms & Named Reactions Handouts', subject: 'Chemistry', size: '6.8 MB', pages: 45, downloads: 2100 },
    { id: 'mat4', title: 'Modern Physics Quick Revision Notes', subject: 'Physics', size: '1.9 MB', pages: 16, downloads: 830 },
  ];

  const filtered = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Study Materials & Notes</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Download high-yield PDFs, formula sheets, and handwritten lecture notes</p>
        </div>
      </div>

      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search study materials..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((mat) => (
          <div key={mat.id} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                <HiBookOpen className="h-5 w-5" />
              </div>
              <div>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{mat.subject}</span>
                <h3 className="mt-1 text-sm font-bold text-gray-900 dark:text-white">{mat.title}</h3>
                <p className="text-[11px] text-gray-400">{mat.pages} Pages • {mat.size} • {mat.downloads} downloads</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Link to={`/materials/${mat.id}`} className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200">
                Read Online
              </Link>
              <button onClick={() => toast.success(`Downloading ${mat.title}...`)} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700">
                <HiArrowDownTray className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialListPage;
