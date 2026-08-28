import React from 'react';
import { HiShieldCheck, HiPlus } from 'react-icons/hi2';

export const AdminRolesPage = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Roles & Permissions (RBAC)</h1>
          <p className="text-xs text-gray-500">Configure role-based access control for students, instructors, and superadmins</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <p className="text-xs text-gray-500">Role permissions and administrative policy configuration.</p>
      </div>
    </div>
  );
};

export default AdminRolesPage;
