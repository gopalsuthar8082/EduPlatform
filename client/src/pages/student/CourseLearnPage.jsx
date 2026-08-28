import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiAcademicCap,
  HiBookOpen,
  HiPlayCircle,
  HiClipboardDocumentCheck,
  HiCheckCircle,
  HiChevronDown,
  HiChevronRight,
  HiArrowLeft,
  HiArrowRight,
  HiBars3BottomLeft,
  HiXMark,
  HiDocumentText,
} from 'react-icons/hi2';
import useFetch from '../../hooks/useFetch.js';
import courseService from '../../services/courseService.js';
import TopicPage from './TopicPage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

export const CourseLearnPage = () => {
  const { id: courseId, topicId: urlTopicId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState({ sub1: true, sub2: true });
  const [expandedChapters, setExpandedChapters] = useState({ ch1: true, ch2: true, ch3: true });

  const { data: course, loading } = useFetch(
    () => courseService.getCourseById(courseId),
    [courseId]
  );

  const curriculum = course?.curriculum || [];

  // Flatten all topics to support previous/next navigation
  const allTopics = useMemo(() => {
    const list = [];
    curriculum.forEach((sub) => {
      sub.chapters?.forEach((ch) => {
        ch.topics?.forEach((top) => {
          list.push({
            ...top,
            chapterTitle: ch.title,
            subjectTitle: sub.title,
          });
        });
      });
    });
    return list;
  }, [curriculum]);

  // Current active topic ID
  const activeTopicId = urlTopicId || (allTopics.length > 0 ? allTopics[0]._id : 'top1');
  const currentTopicIndex = allTopics.findIndex((t) => t._id === activeTopicId);

  const prevTopic = currentTopicIndex > 0 ? allTopics[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex >= 0 && currentTopicIndex < allTopics.length - 1 ? allTopics[currentTopicIndex + 1] : null;

  const toggleSubject = (subId) => {
    setExpandedSubjects((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  const toggleChapter = (chId) => {
    setExpandedChapters((prev) => ({ ...prev, [chId]: !prev[chId] }));
  };

  const handleSelectTopic = (topId) => {
    navigate(`/courses/${courseId}/learn/${topId}`);
    setSidebarOpen(false);
  };

  const handleMarkCompleted = async () => {
    try {
      await courseService.markTopicProgress(activeTopicId, 'completed');
      toast.success('Topic marked as completed! 🎉');
      if (nextTopic) {
        navigate(`/courses/${courseId}/learn/${nextTopic._id}`);
      }
    } catch (err) {
      toast.error('Failed to update topic progress');
    }
  };

  if (loading && !course) {
    return <LoadingSpinner text="Loading course classroom environment..." />;
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold">Course Not Found</h2>
        <Link to="/courses" className="text-sm text-indigo-600">Back to Courses</Link>
      </div>
    );
  }

  const completedCount = allTopics.filter((t) => t.isCompleted).length;
  const overallProgress = allTopics.length > 0 ? Math.round((completedCount / allTopics.length) * 100) : (course.progress || 45);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Course Progress Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to={`/courses/${courseId}`}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title="Course Details"
            >
              <HiArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Active Classroom
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                {course.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Mobile toggle for curriculum */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 lg:hidden"
            >
              <HiBars3BottomLeft className="h-4 w-4" />
              <span>Curriculum Tree</span>
            </button>

            <button
              type="button"
              onClick={handleMarkCompleted}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <HiCheckCircle className="h-4 w-4" />
              <span>Mark Complete</span>
            </button>
          </div>
        </div>

        {/* Course Progress bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-500 dark:text-gray-400">
              Overall Course Progress ({completedCount}/{allTopics.length || 10} Topics Completed)
            </span>
            <span className="text-indigo-600 dark:text-indigo-400">{overallProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Curriculum Sidebar + Right Topic Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Curriculum Tree (Desktop: 4 cols, Mobile: Drawer / Modal) */}
        <div
          className={`lg:col-span-4 ${
            sidebarOpen
              ? 'fixed inset-0 z-50 flex bg-gray-900/60 p-4 lg:relative lg:inset-auto lg:z-auto lg:p-0'
              : 'hidden lg:block'
          }`}
        >
          <div className="w-full max-h-[82vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Course Syllabus Tree
              </h3>
              {sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600 lg:hidden"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Tree Items */}
            <div className="space-y-3">
              {curriculum.map((subject) => {
                const isSubOpen = expandedSubjects[subject._id] ?? true;
                return (
                  <div key={subject._id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleSubject(subject._id)}
                      className="flex w-full items-center justify-between rounded-xl bg-gray-50 p-2.5 text-left text-xs font-bold text-gray-900 dark:bg-gray-800/80 dark:text-white"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <HiAcademicCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{subject.title}</span>
                      </div>
                      {isSubOpen ? (
                        <HiChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <HiChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {isSubOpen && (
                      <div className="pl-3 space-y-2 pt-1">
                        {subject.chapters?.map((chapter) => {
                          const isChOpen = expandedChapters[chapter._id] ?? true;
                          return (
                            <div key={chapter._id} className="space-y-1">
                              <button
                                type="button"
                                onClick={() => toggleChapter(chapter._id)}
                                className="flex w-full items-center justify-between text-left text-[11px] font-bold text-gray-600 dark:text-gray-300 py-1 px-1.5"
                              >
                                <span className="truncate">{chapter.title}</span>
                                {isChOpen ? (
                                  <HiChevronDown className="h-3 w-3 text-gray-400" />
                                ) : (
                                  <HiChevronRight className="h-3 w-3 text-gray-400" />
                                )}
                              </button>

                              {isChOpen && (
                                <div className="space-y-1 pl-2 border-l border-gray-200 dark:border-gray-700">
                                  {chapter.topics?.map((topic) => {
                                    const isCurrent = topic._id === activeTopicId;
                                    return (
                                      <button
                                        key={topic._id}
                                        type="button"
                                        onClick={() => handleSelectTopic(topic._id)}
                                        className={`flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition-colors cursor-pointer ${
                                          isCurrent
                                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          {topic.isCompleted ? (
                                            <HiCheckCircle
                                              className={`h-4 w-4 flex-shrink-0 ${
                                                isCurrent ? 'text-white' : 'text-emerald-500'
                                              }`}
                                            />
                                          ) : (
                                            <div
                                              className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                                isCurrent ? 'bg-white' : 'bg-gray-300 dark:bg-gray-600'
                                              }`}
                                            />
                                          )}
                                          <span className="truncate">{topic.title}</span>
                                        </div>
                                        <span
                                          className={`text-[10px] ml-1 flex-shrink-0 ${
                                            isCurrent ? 'text-indigo-100' : 'text-gray-400'
                                          }`}
                                        >
                                          {topic.duration}
                                        </span>
                                      </button>
                                    );
                                  })}
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
        </div>

        {/* Right Main Content: TopicPage & Navigation Buttons */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Topic Page */}
          <TopicPage topicIdProp={activeTopicId} courseDataProp={course} />

          {/* Bottom Navigation Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-850">
            {prevTopic ? (
              <button
                type="button"
                onClick={() => handleSelectTopic(prevTopic._id)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors"
              >
                <HiArrowLeft className="h-4 w-4" />
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] text-gray-400 uppercase">Previous</p>
                  <p className="truncate max-w-[150px]">{prevTopic.title}</p>
                </div>
                <span className="sm:hidden">Previous</span>
              </button>
            ) : (
              <div />
            )}

            {nextTopic ? (
              <button
                type="button"
                onClick={() => handleSelectTopic(nextTopic._id)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-indigo-200 uppercase">Next Topic</p>
                  <p className="truncate max-w-[150px]">{nextTopic.title}</p>
                </div>
                <span className="sm:hidden">Next</span>
                <HiArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  toast.success('Congratulations on finishing all topics in this course! 🎉');
                  navigate(`/courses/${courseId}`);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
              >
                <span>Course Completed!</span>
                <HiCheckCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearnPage;
