import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPlayCircle, HiMagnifyingGlass, HiClock, HiAcademicCap } from 'react-icons/hi2';

export const LectureListPage = () => {
  const [search, setSearch] = useState('');

  const lectures = [
    { id: 'lec1', title: 'Mastering Indeterminate Forms & L\'Hôpital\'s Rule', course: 'JEE Advanced Math', instructor: 'Dr. Rajesh Sharma', duration: '45:30', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80', views: 3400 },
    { id: 'lec2', title: 'Rotational Dynamics: Torque & Angular Momentum', course: 'NEET Physics Mastery', instructor: 'Prof. Ananya Sen', duration: '52:10', thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80', views: 2890 },
    { id: 'lec3', title: 'Electrophilic Aromatic Substitution Mechanisms', course: 'Organic Chemistry', instructor: 'Dr. Vikram Malhotra', duration: '48:15', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80', views: 4100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Video Lectures Library</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Stream high definition concept lectures and problem solving breakdowns</p>
        </div>
      </div>

      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search video lectures by title or instructor..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lectures.map((lec) => (
          <div key={lec.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-850">
            <div className="relative h-44 w-full bg-gray-900">
              <img src={lec.thumbnail} alt={lec.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200 opacity-90" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <HiPlayCircle className="h-12 w-12 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                {lec.duration}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">{lec.course}</span>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 dark:text-white">{lec.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{lec.instructor} • {lec.views.toLocaleString()} views</p>
              <Link to={`/lectures/${lec.id}`} className="mt-2 block w-full rounded-xl bg-indigo-600 py-2 text-center text-xs font-bold text-white hover:bg-indigo-700 transition-colors">
                Watch Lecture
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LectureListPage;
