import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiStar,
  HiUserGroup,
  HiAcademicCap,
  HiClock,
  HiArrowRight,
  HiCheckCircle,
  HiXMark,
} from 'react-icons/hi2';
import useFetch from '../../hooks/useFetch.js';
import courseService from '../../services/courseService.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

export const CourseListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [enrollmentStatus, setEnrollmentStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: coursesData, loading, refetch } = useFetch(
    courseService.getCourses,
    []
  );

  const courses = useMemo(() => {
    return coursesData?.data || (Array.isArray(coursesData) ? coursesData : []);
  }, [coursesData]);

  // Categories & difficulties for filter buttons/dropdowns
  const categories = ['All', 'Engineering (JEE)', 'Medical (NEET)', 'Chemistry', 'Computer Science', 'Civil Services', 'Biology'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat =
        selectedCategory === 'All' || course.category === selectedCategory;

      const matchDiff =
        selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;

      const matchStatus =
        enrollmentStatus === 'All'
          ? true
          : enrollmentStatus === 'Enrolled'
          ? course.isEnrolled
          : !course.isEnrolled;

      return matchSearch && matchCat && matchDiff && matchStatus;
    });
  }, [courses, searchTerm, selectedCategory, selectedDifficulty, enrollmentStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const handleEnroll = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await courseService.enrollCourse(courseId);
      toast.success('Successfully enrolled in course!');
      refetch();
    } catch (err) {
      toast.error('Enrollment failed. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setEnrollmentStatus('All');
    setCurrentPage(1);
  };

  if (loading && courses.length === 0) {
    return <LoadingSpinner text="Loading courses catalog..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Explore Courses & Curricula
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Master competitive exam subjects with structured notes, video lectures, and diagnostic tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            {filteredCourses.length} Courses Found
          </span>
        </div>
      </div>

      {/* Search Bar + Filter Panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
        {/* Search input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <HiMagnifyingGlass className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by course title, topics, concepts, or instructor name..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-white py-1.5 px-2.5 text-xs font-medium text-gray-700 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-white py-1.5 px-2.5 text-xs font-medium text-gray-700 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Enrollment Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Status:</span>
              <select
                value={enrollmentStatus}
                onChange={(e) => {
                  setEnrollmentStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-white py-1.5 px-2.5 text-xs font-medium text-gray-700 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="All">All Courses</option>
                <option value="Enrolled">My Enrolled</option>
                <option value="Not Enrolled">Not Enrolled</option>
              </select>
            </div>
          </div>

          {(searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All' || enrollmentStatus !== 'All') && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {paginatedCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedCourses.map((course) => (
            <div
              key={course._id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-850"
            >
              <div>
                {/* Course Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-tr from-indigo-800 to-indigo-500">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">
                      <HiAcademicCap className="h-16 w-16 opacity-30" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {course.category}
                    </span>
                    {course.tag && (
                      <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-gray-900 shadow-sm">
                        {course.tag}
                      </span>
                    )}
                  </div>

                  <span className="absolute top-3 right-3 rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold text-gray-800 dark:bg-gray-900/90 dark:text-gray-200">
                    {course.difficulty}
                  </span>
                </div>

                {/* Course Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <HiStar className="h-4 w-4 fill-amber-400" />
                      <span>{course.rating || '4.8'}</span>
                      <span className="text-gray-400 font-normal">
                        ({course.ratingsCount || 120})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiUserGroup className="h-4 w-4 text-gray-400" />
                      <span>{course.enrolledCount?.toLocaleString() || 1200} Enrolled</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 line-clamp-2 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 dark:text-gray-400 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Instructor row */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <img
                      src={
                        course.instructor?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                      }
                      alt={course.instructor?.name || 'Instructor'}
                      className="h-7 w-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {course.instructor?.name || 'Lead Faculty'}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {course.duration || '80+ Hours'}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar if enrolled */}
                  {course.isEnrolled && (
                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        <span>Enrolled ({course.progress}% done)</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="border-t border-gray-100 p-4 dark:border-gray-800 flex items-center gap-2">
                <Link
                  to={`/courses/${course._id}`}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-center text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  View Details
                </Link>

                {course.isEnrolled ? (
                  <Link
                    to={`/courses/${course._id}/learn`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-center text-xs font-bold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 transition-colors"
                  >
                    <span>Continue</span>
                    <HiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleEnroll(e, course._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-center text-xs font-bold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    <HiCheckCircle className="h-4 w-4" />
                    <span>Enroll Free</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-850">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <HiAcademicCap className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">
            No courses found matching your criteria
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or browsing other categories.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(currentPage * itemsPerPage, filteredCourses.length)}
            </span>{' '}
            of <span className="font-semibold">{filteredCourses.length}</span> courses
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
