import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { HiOutlineShieldExclamation, HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import Button from '../common/Button.jsx';

/**
 * ProtectedRoute Component
 * Guards routes based on authentication and user roles
 * 
 * @param {React.ReactNode} children
 * @param {Array<string>} roles - Optional array of authorized user roles
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Authenticating session..." />
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role authorization check
  if (roles && roles.length > 0) {
    const userRole = user?.role || 'student';
    const isAuthorized = roles.includes(userRole);

    if (!isAuthorized) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <HiOutlineShieldExclamation className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">403 - Access Denied</h2>
            <p className="text-sm text-gray-600 mb-6">
              You do not have the required permissions to access this page. Please contact your system administrator if you believe this is an error.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                icon={HiOutlineArrowLeft}
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
              <Link to={userRole === 'admin' || userRole === 'superadmin' ? '/admin/dashboard' : '/dashboard'}>
                <Button
                  variant="primary"
                  size="md"
                  icon={HiOutlineHome}
                >
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
