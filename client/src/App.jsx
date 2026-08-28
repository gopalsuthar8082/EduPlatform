import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

// Lazy-loaded Public / Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'));

// Lazy-loaded Student Dashboard & Course Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard.jsx'));
const CourseListPage = lazy(() => import('./pages/student/CourseListPage.jsx'));
const CourseDetailPage = lazy(() => import('./pages/student/CourseDetailPage.jsx'));
const CourseLearnPage = lazy(() => import('./pages/student/CourseLearnPage.jsx'));
const TopicPage = lazy(() => import('./pages/student/TopicPage.jsx'));

// Lazy-loaded Student Learning Materials & Features
const MaterialListPage = lazy(() => import('./pages/student/MaterialListPage.jsx'));
const MaterialReaderPage = lazy(() => import('./pages/student/MaterialReaderPage.jsx'));
const LectureListPage = lazy(() => import('./pages/student/LectureListPage.jsx'));
const LecturePlayerPage = lazy(() => import('./pages/student/LecturePlayerPage.jsx'));
const QuizListPage = lazy(() => import('./pages/student/QuizListPage.jsx'));
const QuizAttemptPage = lazy(() => import('./pages/student/QuizAttemptPage.jsx'));
const QuizResultPage = lazy(() => import('./pages/student/QuizResultPage.jsx'));
const QuestionBankPage = lazy(() => import('./pages/student/QuestionBankPage.jsx'));
const QuestionPaperListPage = lazy(() => import('./pages/student/QuestionPaperListPage.jsx'));
const QuestionPaperViewPage = lazy(() => import('./pages/student/QuestionPaperViewPage.jsx'));
const TestListPage = lazy(() => import('./pages/student/TestListPage.jsx'));
const TestInstructionPage = lazy(() => import('./pages/student/TestInstructionPage.jsx'));
const CBTExamPage = lazy(() => import('./pages/student/CBTExamPage.jsx'));
const TestResultPage = lazy(() => import('./pages/student/TestResultPage.jsx'));
const DiscussionListPage = lazy(() => import('./pages/student/DiscussionListPage.jsx'));
const DiscussionDetailPage = lazy(() => import('./pages/student/DiscussionDetailPage.jsx'));
const CreateDiscussionPage = lazy(() => import('./pages/student/CreateDiscussionPage.jsx'));
const PollListPage = lazy(() => import('./pages/student/PollListPage.jsx'));
const ProfilePage = lazy(() => import('./pages/student/ProfilePage.jsx'));
const PerformancePage = lazy(() => import('./pages/student/PerformancePage.jsx'));
const LeaderboardPage = lazy(() => import('./pages/student/LeaderboardPage.jsx'));

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage.jsx'));
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage.jsx'));
const AdminSubjectsPage = lazy(() => import('./pages/admin/AdminSubjectsPage.jsx'));
const AdminMaterialsPage = lazy(() => import('./pages/admin/AdminMaterialsPage.jsx'));
const AdminLecturesPage = lazy(() => import('./pages/admin/AdminLecturesPage.jsx'));
const AdminQuestionsPage = lazy(() => import('./pages/admin/AdminQuestionsPage.jsx'));
const AdminQuestionPapersPage = lazy(() => import('./pages/admin/AdminQuestionPapersPage.jsx'));
const AdminQuizzesPage = lazy(() => import('./pages/admin/AdminQuizzesPage.jsx'));
const AdminTestsPage = lazy(() => import('./pages/admin/AdminTestsPage.jsx'));
const AdminDiscussionsPage = lazy(() => import('./pages/admin/AdminDiscussionsPage.jsx'));
const AdminPollsPage = lazy(() => import('./pages/admin/AdminPollsPage.jsx'));
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AdminAnnouncementsPage.jsx'));
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage.jsx'));

// Lazy-loaded 404 Page
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

/**
 * Root Redirect Handler: Redirect to /dashboard if authenticated, else /login
 */
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner fullScreen text="Checking session..." />;
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Suspense fallback={<LoadingSpinner fullScreen text="Loading EduPlatform..." />}>
            <Routes>
              {/* Default root path */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Standalone Fullscreen CBT Exam Route (No Dashboard Layout wrapper) */}
              <Route
                path="/tests/:id/exam"
                element={
                  <ProtectedRoute>
                    <CBTExamPage />
                  </ProtectedRoute>
                }
              />

              {/* Student Protected Routes (Wrapped in DashboardLayout) */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/courses" element={<CourseListPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/courses/:id/learn" element={<CourseLearnPage />} />
                <Route path="/courses/:id/learn/:topicId" element={<CourseLearnPage />} />
                <Route path="/materials" element={<MaterialListPage />} />
                <Route path="/materials/:id" element={<MaterialReaderPage />} />
                <Route path="/lectures" element={<LectureListPage />} />
                <Route path="/lectures/:id" element={<LecturePlayerPage />} />
                <Route path="/quizzes" element={<QuizListPage />} />
                <Route path="/quizzes/:id" element={<QuizAttemptPage />} />
                <Route path="/quizzes/:id/result" element={<QuizResultPage />} />
                <Route path="/question-bank" element={<QuestionBankPage />} />
                <Route path="/question-papers" element={<QuestionPaperListPage />} />
                <Route path="/question-papers/:id" element={<QuestionPaperViewPage />} />
                <Route path="/tests" element={<TestListPage />} />
                <Route path="/tests/:id/instructions" element={<TestInstructionPage />} />
                <Route path="/tests/:id/result" element={<TestResultPage />} />
                <Route path="/discussions" element={<DiscussionListPage />} />
                <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
                <Route path="/discussions/create" element={<CreateDiscussionPage />} />
                <Route path="/polls" element={<PollListPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
              </Route>

              {/* Admin Protected Routes (Role: admin, superadmin - Wrapped in DashboardLayout) */}
              <Route
                element={
                  <ProtectedRoute roles={['admin', 'superadmin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/courses" element={<AdminCoursesPage />} />
                <Route path="/admin/subjects" element={<AdminSubjectsPage />} />
                <Route path="/admin/materials" element={<AdminMaterialsPage />} />
                <Route path="/admin/lectures" element={<AdminLecturesPage />} />
                <Route path="/admin/questions" element={<AdminQuestionsPage />} />
                <Route path="/admin/question-papers" element={<AdminQuestionPapersPage />} />
                <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
                <Route path="/admin/tests" element={<AdminTestsPage />} />
                <Route path="/admin/discussions" element={<AdminDiscussionsPage />} />
                <Route path="/admin/polls" element={<AdminPollsPage />} />
                <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
                <Route path="/admin/roles" element={<AdminRolesPage />} />
              </Route>

              {/* Catch-all Unmatched 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
