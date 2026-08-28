import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HiAcademicCap,
  HiClock,
  HiUserGroup,
  HiStar,
  HiBookOpen,
  HiPlayCircle,
  HiClipboardDocumentCheck,
  HiCheckCircle,
  HiChevronDown,
  HiChevronRight,
  HiArrowRight,
  HiDocumentText,
  HiShieldCheck,
  HiArrowLeft,
} from 'react-icons/hi2';
import useFetch from '../../hooks/useFetch.js';
import courseService from '../../services/courseService.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview | curriculum | reviews
  const [expandedSubjects, setExpandedSubjects] = useState({ sub1: true, sub2: true });
  const [expandedChapters, setExpandedChapters] = useState({ ch1: true, ch2: true, ch3: true });

  const { data: course, loading, refetch } = useFetch(
    () => courseService.getCourseById(id),
    [id]
  );

  const toggleSubject = (subId) => {
    setExpandedSubjects((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  const toggleChapter = (chId) => {
    setExpandedChapters((prev) => ({ ...prev, [chId]: !prev[chId] }));
  };

  const handleEnroll = async () => {
    try {
      await courseService.enrollCourse(id);
      toast.success('Successfully enrolled in course!');
      refetch();
    } catch (err) {
      toast.error('Enrollment failed.');
    }
  };

  if (loading && !course) {
    return <LoadingSpinner text="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Course Not Found</h2>
        <Link
          to="/courses"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
        >
          <HiArrowLeft className="h-4 w-4" /> Back to courses catalog
        </Link>
      </div>
    );
  }

  const curriculum = course.curriculum || [];
  const stats = course.stats || {
    chapters: 12,
    topics: 48,
    lectures: 36,
    quizzes: 24,
    studyMaterials: 30,
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back to courses */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to all courses
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-500/30 backdrop-blur-md px-3 py-1 text-xs font-bold text-indigo-200 border border-indigo-500/40">
                {course.category}
              </span>
              <span className="rounded-md bg-amber-500/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                {course.difficulty} Level
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              {course.description}
            </p>

            {/* Quick metadata */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <HiStar className="h-5 w-5 fill-amber-400" />
                <span>{course.rating || '4.9'}</span>
                <span className="text-gray-400 font-normal">
                  ({course.ratingsCount?.toLocaleString() || 1400} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiUserGroup className="h-5 w-5 text-indigo-400" />
                <span>{course.enrolledCount?.toLocaleString() || '8,500'} students enrolled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiClock className="h-5 w-5 text-indigo-400" />
                <span>{course.duration || '96 Hours'} of self-paced content</span>
              </div>
            </div>

            {/* Instructor row */}
            <div className="flex items-center gap-3 pt-3">
              <img
                src={
                  course.instructor?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                }
                alt={course.instructor?.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-400"
              />
              <div>
                <p className="text-sm font-bold text-white">
                  {course.instructor?.name || 'Lead Faculty'}
                </p>
                <p className="text-xs text-gray-400">
                  {course.instructor?.title || 'Senior Professor & Subject Expert'}
                </p>
              </div>
            </div>
          </div>

          {/* Hero Thumbnail Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-60 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              {course.isEnrolled ? (
                <Link
                  to={`/courses/${course._id}/learn`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition-colors"
                >
                  <HiPlayCircle className="h-5 w-5" />
                  Continue Learning ({course.progress || 0}%)
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition-colors cursor-pointer"
                >
                  <HiCheckCircle className="h-5 w-5" />
                  Enroll in Course Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Content Tabs + Sticky Sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Navigation Tabs & Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Overview & Objectives
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Curriculum Tree
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Reviews & Ratings
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Full Description */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  About This Course
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {course.fullDescription || course.description}
                </p>
              </div>

              {/* What you'll learn */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  What You'll Learn
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(course.learningOutcomes || [
                    'Master core concepts and advanced exam patterns',
                    'Solve challenging multi-step conceptual problems',
                    'Learn time-saving tips, tricks, and shortcuts',
                    'Access curated practice tests and high-yield notes',
                  ]).map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <HiCheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Prerequisites
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  {(course.prerequisites || ['Basic High School Mathematics']).map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: CURRICULUM ACCORDION */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Course Content & Syllabus
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {curriculum.length} Subjects • {stats.chapters} Chapters • {stats.topics} Topics
                </span>
              </div>

              <div className="space-y-3">
                {curriculum.map((subject) => {
                  const isSubOpen = expandedSubjects[subject._id] ?? true;
                  return (
                    <div
                      key={subject._id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-850"
                    >
                      {/* Subject Header */}
                      <button
                        type="button"
                        onClick={() => toggleSubject(subject._id)}
                        className="flex w-full items-center justify-between bg-gray-50/80 p-4 text-left font-bold text-gray-900 dark:bg-gray-800/80 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <HiAcademicCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-sm">{subject.title}</span>
                        </div>
                        {isSubOpen ? (
                          <HiChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <HiChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </button>

                      {/* Subject Chapters */}
                      {isSubOpen && (
                        <div className="divide-y divide-gray-100 p-2 dark:divide-gray-800">
                          {subject.chapters?.map((chapter) => {
                            const isChOpen = expandedChapters[chapter._id] ?? true;
                            return (
                              <div key={chapter._id} className="p-2 space-y-2">
                                <button
                                  type="button"
                                  onClick={() => toggleChapter(chapter._id)}
                                  className="flex w-full items-center justify-between text-left text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <HiBookOpen className="h-4 w-4 text-gray-400" />
                                    <span>{chapter.title}</span>
                                  </div>
                                  <span className="text-[11px] text-gray-400">
                                    {chapter.topics?.length || 0} topics
                                  </span>
                                </button>

                                {/* Chapter Topics */}
                                {isChOpen && (
                                  <div className="pl-6 space-y-1.5">
                                    {chapter.topics?.map((topic) => (
                                      <Link
                                        key={topic._id}
                                        to={`/courses/${course._id}/learn/${topic._id}`}
                                        className="flex items-center justify-between rounded-xl p-2.5 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400 transition-colors"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          {topic.isCompleted ? (
                                            <HiCheckCircle className="h-4 w-4 text-emerald-500" />
                                          ) : (
                                            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                                          )}
                                          <span className="font-medium">{topic.title}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-400">
                                          {topic.hasLecture && (
                                            <HiPlayCircle className="h-4 w-4 text-indigo-500" title="Lecture available" />
                                          )}
                                          {topic.materialsCount > 0 && (
                                            <HiDocumentText className="h-4 w-4 text-blue-500" title="Study Notes" />
                                          )}
                                          {topic.hasQuiz && (
                                            <HiClipboardDocumentCheck className="h-4 w-4 text-amber-500" title="Quiz available" />
                                          )}
                                          <span className="text-[10px]">{topic.duration}</span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {course.rating || '4.9'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className="h-5 w-5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Based on {course.ratingsCount || 1420} student evaluations
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                {[
                  {
                    name: 'Kunal Sharma',
                    rating: 5,
                    date: '1 week ago',
                    comment:
                      'The calculus explanations are top notch. The problem-solving shortcuts helped me save at least 20 minutes in the mock test!',
                  },
                  {
                    name: 'Meera Iyer',
                    rating: 5,
                    date: '3 weeks ago',
                    comment:
                      'Extremely structured curriculum. High yield notes and quizzes after every single topic made revision effortless.',
                  },
                ].map((rev, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 dark:border-gray-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 dark:text-white">{rev.name}</span>
                      <span className="text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <HiStar key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Sticky Course Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Full Access Includes
              </p>
              <div className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HiBookOpen className="h-4 w-4 text-indigo-500" />
                    Chapters & Modules
                  </span>
                  <span className="font-bold">{stats.chapters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HiAcademicCap className="h-4 w-4 text-indigo-500" />
                    Total Topics
                  </span>
                  <span className="font-bold">{stats.topics}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HiPlayCircle className="h-4 w-4 text-indigo-500" />
                    Video Lectures
                  </span>
                  <span className="font-bold">{stats.lectures}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HiClipboardDocumentCheck className="h-4 w-4 text-indigo-500" />
                    Topic Quizzes
                  </span>
                  <span className="font-bold">{stats.quizzes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HiDocumentText className="h-4 w-4 text-indigo-500" />
                    Downloadable PDFs
                  </span>
                  <span className="font-bold">{stats.studyMaterials}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
              {course.isEnrolled ? (
                <Link
                  to={`/courses/${course._id}/learn`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors"
                >
                  <span>Go to Course Classroom</span>
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <HiCheckCircle className="h-4 w-4" />
                  <span>Enroll in Course</span>
                </button>
              )}
            </div>

            <div className="rounded-xl bg-gray-50 p-3 text-center text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              ⚡ 100% Free digital access for registered students
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
