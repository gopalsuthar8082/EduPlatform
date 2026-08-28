import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HiBookOpen,
  HiPlayCircle,
  HiClipboardDocumentCheck,
  HiQuestionMarkCircle,
  HiChatBubbleLeftRight,
  HiArrowDownTray,
  HiCheckCircle,
  HiHandThumbUp,
  HiPaperAirplane,
  HiEye,
  HiSparkles,
} from 'react-icons/hi2';
import useFetch from '../../hooks/useFetch.js';
import courseService from '../../services/courseService.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

export const TopicPage = ({ topicIdProp, courseDataProp }) => {
  const params = useParams();
  const topicId = topicIdProp || params.topicId || 'top1';
  const courseId = params.id || courseDataProp?._id || 'c1';

  const [activeTab, setActiveTab] = useState('materials'); // materials | lecture | quiz | questions | discussion
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [newDiscussion, setNewDiscussion] = useState('');
  const [discussionsList, setDiscussionsList] = useState([]);

  const { data: topicData, loading } = useFetch(
    () => courseService.getTopicDetails(topicId),
    [topicId]
  );

  const topic = topicData || {
    _id: topicId,
    title: 'Standard Limits and L\'Hôpital\'s Rule',
    courseId: courseId,
    courseTitle: 'Complete JEE Advanced Mathematics Masterclass',
    chapterTitle: 'Limits, Continuity & Differentiability',
    subjectTitle: 'Differential & Integral Calculus',
    description: 'Understand indeterminate forms (0/0, inf/inf, 0*inf, 1^inf), algebraic factorization, trigonometric limit expansions, and rigorous application of L\'Hôpital\'s rule.',
    isCompleted: false,
    studyMaterials: [
      {
        _id: 'mat1',
        title: 'Comprehensive Notes on Limits & Expansions',
        type: 'PDF',
        fileSize: '3.4 MB',
        pages: 18,
        url: '#',
      },
      {
        _id: 'mat2',
        title: 'Formula Cheat Sheet - Series Expansions',
        type: 'PDF',
        fileSize: '1.1 MB',
        pages: 4,
        url: '#',
      },
    ],
    lectures: [
      {
        _id: 'lec1',
        title: 'Video Lecture: Mastering Indeterminate Forms & L\'Hôpital\'s Rule',
        duration: '45:30',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        instructor: 'Dr. Rajesh Sharma',
      },
    ],
    quizzes: [
      {
        _id: 'quiz1',
        title: 'Topic Quiz: Standard Limits & 1^Infinity Form',
        questionsCount: 15,
        durationMinutes: 30,
        marks: 60,
        status: 'Attempted (Score: 52/60)',
      },
      {
        _id: 'quiz2',
        title: 'Advanced Diagnostic Quiz: Series Expansion Shortcuts',
        questionsCount: 10,
        durationMinutes: 20,
        marks: 40,
        status: 'Not Attempted',
      },
    ],
    questions: [
      {
        _id: 'q1',
        questionText: 'Evaluate the limit as x approaches 0 of (sin x - x + x^3/6) / x^5.',
        difficulty: 'Hard',
        type: 'MCQ',
        options: ['1/120', '1/60', '1/24', '0'],
        correctOption: 0,
        explanation: 'Using the Taylor series expansion of sin x = x - x^3/3! + x^5/5! - ... we get (x^5/120)/x^5 = 1/120.',
      },
      {
        _id: 'q2',
        questionText: 'Find the value of lim x->inf ( (x+6)/(x+1) )^(x+4).',
        difficulty: 'Medium',
        type: 'MCQ',
        options: ['e^5', 'e^6', 'e^4', '1'],
        correctOption: 0,
        explanation: 'This is in the 1^inf form. Limit = exp( lim x->inf (x+4)*((x+6)/(x+1) - 1) ) = exp( lim x->inf (x+4)*(5/(x+1)) ) = e^5.',
      },
    ],
    discussions: [
      {
        _id: 'disc1',
        author: 'Aarav Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        createdAt: '2 days ago',
        title: 'When is it safer to use Series Expansion instead of repeated L\'Hôpital?',
        content: 'Whenever higher order derivatives become tedious (like sin(tan x) - tan(sin x)), Taylor expansion up to x^7 simplifies in 2 lines rather than differentiating 5 times.',
        upvotes: 18,
        repliesCount: 4,
      },
    ],
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleExplanation = (qId) => {
    setShowExplanation((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handlePostDiscussion = (e) => {
    e.preventDefault();
    if (!newDiscussion.trim()) return;
    const item = {
      _id: `disc_${Date.now()}`,
      author: 'You (Student)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      createdAt: 'Just now',
      title: 'Topic Discussion Query',
      content: newDiscussion.trim(),
      upvotes: 1,
      repliesCount: 0,
    };
    setDiscussionsList((prev) => [item, ...prev]);
    setNewDiscussion('');
    toast.success('Question posted to topic discussion!');
  };

  const allDiscussions = [...discussionsList, ...(topic.discussions || [])];

  if (loading && !topicData) {
    return <LoadingSpinner text="Loading topic content..." />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Topic Title Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Link
            to={`/courses/${courseId}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
          >
            {topic.courseTitle || 'Course'}
          </Link>
          <span>/</span>
          <span className="truncate">{topic.subjectTitle || 'Subject'}</span>
          <span>/</span>
          <span className="text-indigo-600 font-semibold dark:text-indigo-400 truncate">
            {topic.chapterTitle || 'Chapter'}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
          {topic.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {topic.description}
        </p>
      </div>

      {/* 5 Topic Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-white px-2 rounded-xl shadow-xs dark:border-gray-800 dark:bg-gray-850">
        {[
          { id: 'materials', label: 'Study Material', icon: HiBookOpen, count: topic.studyMaterials?.length },
          { id: 'lecture', label: 'Video Lecture', icon: HiPlayCircle, count: topic.lectures?.length },
          { id: 'quiz', label: 'Topic Quizzes', icon: HiClipboardDocumentCheck, count: topic.quizzes?.length },
          { id: 'questions', label: 'Practice Questions', icon: HiQuestionMarkCircle, count: topic.questions?.length },
          { id: 'discussion', label: 'Discussions', icon: HiChatBubbleLeftRight, count: allDiscussions.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}

      {/* 1. STUDY MATERIAL TAB */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Notes & Handouts ({topic.studyMaterials?.length || 0})
            </h3>
            <span className="text-xs text-gray-500">PDFs available for online reading & download</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topic.studyMaterials?.map((mat) => (
              <div
                key={mat._id}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                    <HiBookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                      {mat.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-gray-400">
                      {mat.type} • {mat.fileSize} • {mat.pages} Pages
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    to={`/materials/${mat._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <HiEye className="h-4 w-4" />
                    Read Online
                  </Link>
                  <a
                    href={mat.downloadUrl || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(`Downloading ${mat.title}...`);
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
                  >
                    <HiArrowDownTray className="h-4 w-4" />
                    PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LECTURE TAB */}
      {activeTab === 'lecture' && (
        <div className="space-y-4">
          {topic.lectures?.map((lec) => (
            <div
              key={lec._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {lec.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Instructor: {lec.instructor} • Duration: {lec.duration}
                  </p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 self-start">
                  HD 1080p Video
                </span>
              </div>

              {/* Video Player Placeholder / Embed */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
                <iframe
                  title={lec.title}
                  src={lec.videoUrl}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  Tip: Use playback speed controls and note timestamps for revision.
                </p>
                <Link
                  to={`/lectures/${lec._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  <span>Open Full Video Theatre</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Topic Diagnostic & Practice Quizzes
            </h3>
            <span className="text-xs text-gray-500">Test your mastery of this specific topic</span>
          </div>

          <div className="space-y-3">
            {topic.quizzes?.map((quiz) => (
              <div
                key={quiz._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {quiz.status}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {quiz.questionsCount} Questions • {quiz.durationMinutes} Mins • {quiz.marks} Marks
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {quiz.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/quizzes/${quiz._id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors"
                  >
                    <HiClipboardDocumentCheck className="h-4 w-4" />
                    <span>Attempt Quiz</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PRACTICE QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Curated High-Yield Practice Questions
            </h3>
            <span className="text-xs text-gray-500">Interactive with instant step-by-step solutions</span>
          </div>

          <div className="space-y-4">
            {topic.questions?.map((q, idx) => {
              const selected = selectedAnswers[q._id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctOption;

              return (
                <div
                  key={q._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Question {idx + 1}
                    </span>
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      {q.difficulty}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      let btnClass = 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200';

                      if (isAnswered) {
                        if (optIdx === q.correctOption) {
                          btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold';
                        } else if (isOptionSelected) {
                          btnClass = 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q._id, optIdx)}
                          className={`flex w-full items-center justify-between rounded-xl border p-3 text-xs text-left transition-colors cursor-pointer ${btnClass}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold dark:bg-gray-700">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isAnswered && optIdx === q.correctOption && (
                            <HiCheckCircle className="h-4 w-4 text-emerald-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle */}
                  <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => toggleExplanation(q._id)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      {showExplanation[q._id] ? 'Hide Solution' : 'View Step-by-Step Solution'}
                    </button>
                    {isAnswered && (
                      <span
                        className={`text-xs font-bold ${
                          isCorrect ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}
                      </span>
                    )}
                  </div>

                  {showExplanation[q._id] && (
                    <div className="rounded-xl bg-indigo-50/60 p-3.5 text-xs text-gray-800 dark:bg-indigo-950/40 dark:text-gray-200 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                      <p className="font-bold text-indigo-950 dark:text-indigo-300">
                        Detailed Explanation:
                      </p>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. DISCUSSION TAB */}
      {activeTab === 'discussion' && (
        <div className="space-y-6">
          {/* Post Question Box */}
          <form
            onSubmit={handlePostDiscussion}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3"
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Ask a Doubt or Share Insight on this Topic
            </h3>
            <textarea
              rows={3}
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
              placeholder="Type your question, conceptual doubt, or study tip..."
              className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <HiPaperAirplane className="h-4 w-4" />
                Post to Forum
              </button>
            </div>
          </form>

          {/* Discussions List */}
          <div className="space-y-4">
            {allDiscussions.map((disc) => (
              <div
                key={disc._id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={disc.authorAvatar}
                      alt={disc.author}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {disc.author}
                      </p>
                      <p className="text-[10px] text-gray-400">{disc.createdAt}</p>
                    </div>
                  </div>
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {disc.repliesCount || 0} replies
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  {disc.title}
                </h4>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {disc.content}
                </p>

                <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => toast.success('Upvoted!')}
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <HiHandThumbUp className="h-4 w-4" />
                    <span>{disc.upvotes || 0} Upvotes</span>
                  </button>
                  <Link
                    to={`/discussions/${disc._id}`}
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <HiChatBubbleLeftRight className="h-4 w-4" />
                    <span>Reply</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicPage;
