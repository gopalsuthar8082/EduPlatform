import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiAcademicCap,
  HiBookOpen,
  HiClock,
  HiSparkles,
  HiCheckCircle,
  HiPlayCircle,
  HiClipboardDocumentCheck,
  HiArrowRight,
  HiDocumentText,
  HiBolt,
  HiMegaphone,
  HiCalendarDays,
  HiArrowTrendingUp,
} from 'react-icons/hi2';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import useAuth from '../../hooks/useAuth.js';
import useFetch from '../../hooks/useFetch.js';
import dashboardService from '../../services/dashboardService.js';
import StatCard from '../../components/common/StatCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashboard, loading } = useFetch(
    dashboardService.getStudentDashboard,
    []
  );

  if (loading && !dashboard) {
    return <LoadingSpinner size="lg" text="Loading your dashboard analytics..." />;
  }

  const studentName = user?.name || 'Student';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const stats = dashboard?.stats || {
    coursesEnrolled: { value: 4, trend: '+1 this month', isPositive: true },
    questionsSolved: { value: 1248, trend: '+18% vs last week', isPositive: true },
    averageAccuracy: { value: '84.6%', trend: '+3.2% improvement', isPositive: true },
    studyHours: { value: '48.5h', trend: '+5.5h this week', isPositive: true },
  };

  const continueLearning = dashboard?.continueLearning || {
    courseId: 'c1',
    courseTitle: 'Complete JEE Advanced Mathematics Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    lastAccessedType: 'lecture',
    itemTitle: 'Mastering Indeterminate Forms & L\'Hôpital\'s Rule',
    progress: 68,
    totalDuration: '45 mins',
    completedDuration: '30 mins',
    nextTopicId: 'top1',
  };

  const myCourses = dashboard?.myCourses || [];
  const scoreTrend = dashboard?.performance?.scoreTrend || [];
  const subjectAccuracy = dashboard?.performance?.subjectAccuracy || [];
  const recentActivities = dashboard?.recentActivities || [];
  const upcomingTests = dashboard?.upcomingTests || [];
  const aiRecommendations = dashboard?.aiRecommendations || [];
  const announcements = dashboard?.announcements || [];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP WELCOME BANNER & STREAK */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-700/15">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <HiCalendarDays className="h-4 w-4" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {studentName}! 👋
            </h1>
            <p className="mt-1 text-sm text-indigo-100/90 max-w-xl">
              You're making steady progress toward your goals. Keep up the high consistency and ace your upcoming tests!
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Study Streak Badge */}
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md px-4 py-2.5 border border-white/20 shadow-inner">
              <span className="text-2xl animate-bounce">🔥</span>
              <div>
                <p className="text-xs text-indigo-100 font-medium">Study Streak</p>
                <p className="text-lg font-black leading-tight text-white">
                  {dashboard?.streakDays || 14} Days
                </p>
              </div>
            </div>

            <Link
              to="/question-bank"
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-600 shadow-md hover:bg-indigo-50 transition-colors"
            >
              Daily Practice
            </Link>
          </div>
        </div>
      </div>

      {/* 2. QUICK STATS ROW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Courses Enrolled"
          value={stats.coursesEnrolled.value}
          trend={stats.coursesEnrolled.trend}
          isPositive={stats.coursesEnrolled.isPositive}
          icon={HiAcademicCap}
          iconBgColor="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
          onClick={() => navigate('/courses')}
        />
        <StatCard
          title="Questions Solved"
          value={stats.questionsSolved.value}
          trend={stats.questionsSolved.trend}
          isPositive={stats.questionsSolved.isPositive}
          icon={HiClipboardDocumentCheck}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          onClick={() => navigate('/question-bank')}
        />
        <StatCard
          title="Average Accuracy"
          value={stats.averageAccuracy.value}
          trend={stats.averageAccuracy.trend}
          isPositive={stats.averageAccuracy.isPositive}
          icon={HiArrowTrendingUp}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          onClick={() => navigate('/performance')}
        />
        <StatCard
          title="Study Hours"
          value={stats.studyHours.value}
          trend={stats.studyHours.trend}
          isPositive={stats.studyHours.isPositive}
          icon={HiClock}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          onClick={() => navigate('/performance')}
        />
      </div>

      {/* 3. CONTINUE LEARNING SECTION */}
      {continueLearning && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Continue Learning
              </h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Pick up where you left off
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-5 rounded-xl bg-gray-50 p-4 border border-gray-100 dark:bg-gray-800/60 dark:border-gray-800">
            <div className="relative h-28 w-full md:w-48 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
              <img
                src={continueLearning.thumbnail}
                alt={continueLearning.courseTitle}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                {continueLearning.lastAccessedType === 'lecture' ? (
                  <HiPlayCircle className="h-10 w-10 text-white drop-shadow-md" />
                ) : (
                  <HiClipboardDocumentCheck className="h-10 w-10 text-white drop-shadow-md" />
                )}
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="capitalize px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950">
                  {continueLearning.lastAccessedType || 'Lecture'}
                </span>
                <span>•</span>
                <span className="truncate">{continueLearning.courseTitle}</span>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {continueLearning.itemTitle}
              </h3>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Progress</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {continueLearning.progress}% Completed
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${continueLearning.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              to={`/courses/${continueLearning.courseId}/learn/${continueLearning.nextTopicId || 'top1'}`}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              <HiPlayCircle className="h-5 w-5" />
              Continue Learning
            </Link>
          </div>
        </div>
      )}

      {/* 4. MY COURSES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              My Enrolled Courses
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Courses you are currently learning
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View All Courses</span>
            <HiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <div
              key={course._id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-850"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {course.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{course.instructor?.name}</span>
                    <span>{course.subjectsCount} Subjects</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500 dark:text-gray-400">Course Progress</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 p-4 dark:border-gray-800">
                <Link
                  to={`/courses/${course._id}/learn`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-100 py-2.5 text-xs font-bold text-gray-800 hover:bg-indigo-600 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-indigo-600 dark:hover:text-white"
                >
                  <span>Resume Course</span>
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PERFORMANCE OVERVIEW CHARTS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Performance Analytics
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Line Chart: Score Trend */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Score Trend (Last 10 Tests)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your score vs Platform Average
                </p>
              </div>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                +14% Growth
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="test" stroke="#9ca3af" fontSize={11} />
                  <YAxis domain={[40, 100]} stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Your Score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#4f46e5' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="Batch Average"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Subject-wise Accuracy */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Subject-wise Accuracy
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Calculated from all practice questions & quizzes
                </p>
              </div>
              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                84.6% Avg
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAccuracy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="subject" stroke="#9ca3af" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Accuracy']}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="accuracy"
                    name="Accuracy (%)"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 6. THREE-COLUMN SECTION: Recent Activity + Upcoming Tests + AI Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity Timeline */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="relative space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
            {recentActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3 pl-1">
                <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm ring-4 ring-white dark:ring-gray-850">
                  {act.type === 'quiz' && <HiClipboardDocumentCheck className="h-3.5 w-3.5" />}
                  {act.type === 'lecture' && <HiPlayCircle className="h-3.5 w-3.5" />}
                  {act.type === 'material' && <HiBookOpen className="h-3.5 w-3.5" />}
                  {act.type === 'test' && <HiSparkles className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {act.title}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {act.meta}
                    </span>
                    <span className="text-[10px] text-gray-400">{act.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Upcoming Tests & Quizzes
            </h3>
            <Link
              to="/tests"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    {test.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {test.timeRemaining}
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-gray-900 dark:text-white">
                  {test.title}
                </h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span>{test.date}</span>
                  <span>{test.duration} • {test.totalQuestions} Qs</span>
                </div>
                <Link
                  to={`/tests/${test.id}/instructions`}
                  className="mt-3 block w-full rounded-lg bg-indigo-600 py-1.5 text-center text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
                >
                  View Details & Instructions
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* AI Study Assistant Widget */}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/80 to-white p-5 shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/30 dark:to-gray-850">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <HiSparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                AI Study Recommendations
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Personalized based on weak areas
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-indigo-100 bg-white p-3 shadow-xs dark:border-gray-700/80 dark:bg-gray-800"
              >
                <div className="flex items-start gap-2">
                  <HiBolt className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {rec.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                      {rec.reason}
                    </p>
                    <Link
                      to={rec.link}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      <span>{rec.actionText}</span>
                      <HiArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. ANNOUNCEMENTS TICKER */}
      {announcements.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-850">
          <div className="flex items-center gap-2 mb-3">
            <HiMegaphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Platform Announcements & Updates
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      ann.priority === 'Live'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                    {ann.title}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 ml-2 whitespace-nowrap">
                  {ann.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
