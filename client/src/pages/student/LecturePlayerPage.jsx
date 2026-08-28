import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiPlayCircle, HiCheckCircle, HiHandThumbUp, HiBookmark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export const LecturePlayerPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6 pb-12">
      <Link to="/lectures" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
        <HiArrowLeft className="h-4 w-4" /> Back to Lectures
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
        {/* Video Player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
          <iframe
            title="Lecture Player"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Mastering Indeterminate Forms & L'Hôpital's Rule (Lecture #{id})
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              JEE Advanced Mathematics • Dr. Rajesh Sharma • 45:30 mins
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => toast.success('Bookmarked!')} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
              <HiBookmark className="h-4 w-4" /> Bookmark
            </button>
            <button onClick={() => toast.success('Marked as watched!')} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
              <HiCheckCircle className="h-4 w-4" /> Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePlayerPage;
