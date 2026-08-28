import React, { useState, useMemo } from 'react';
import {
  HiOutlineUsers,
  HiOutlineUserPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineLockClosed,
  HiOutlineKey,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal.jsx';

const MOCK_USERS = [
  {
    _id: 'u-1',
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@eduplatform.com',
    role: 'instructor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    joined: '2024-11-12',
    lastActive: '10 mins ago',
    permissions: {
      courses: ['view', 'create', 'edit'],
      materials: ['view', 'create', 'edit', 'delete'],
      questions: ['view', 'create', 'edit'],
      tests: ['view', 'create'],
    },
  },
  {
    _id: 'u-2',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    role: 'student',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    joined: '2025-01-10',
    lastActive: 'Just now',
    permissions: {
      courses: ['view'],
      materials: ['view'],
      questions: ['view'],
    },
  },
  {
    _id: 'u-3',
    name: 'Prof. Ananya Sen',
    email: 'ananya.sen@eduplatform.com',
    role: 'instructor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    joined: '2024-12-01',
    lastActive: '2 hrs ago',
    permissions: {
      courses: ['view', 'create', 'edit'],
      materials: ['view', 'create', 'edit'],
      questions: ['view', 'create', 'edit'],
    },
  },
  {
    _id: 'u-4',
    name: 'Platform Moderator',
    email: 'moderator@eduplatform.com',
    role: 'moderator',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    joined: '2024-10-05',
    lastActive: '1 day ago',
    permissions: {
      discussions: ['view', 'edit', 'delete', 'moderate'],
      polls: ['view', 'edit'],
    },
  },
  {
    _id: 'u-5',
    name: 'Vikram Malhotra',
    email: 'vikram.m@eduplatform.com',
    role: 'content_manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    joined: '2024-09-15',
    lastActive: '5 hrs ago',
    permissions: {
      courses: ['view', 'create', 'edit', 'delete', 'publish'],
      materials: ['view', 'create', 'edit', 'delete', 'publish'],
      questions: ['view', 'create', 'edit', 'delete', 'publish'],
    },
  },
  {
    _id: 'u-6',
    name: 'Spam Account Suspended',
    email: 'spammer_99@fake.org',
    role: 'student',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    joined: '2025-02-01',
    lastActive: '5 days ago',
    permissions: {},
  },
];

const RESOURCE_LIST = ['courses', 'materials', 'lectures', 'questions', 'quizzes', 'tests', 'discussions', 'users'];
const ACTION_LIST = ['view', 'create', 'edit', 'delete', 'publish'];

export const AdminUsersPage = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    status: 'Active',
    avatar: '',
  });

  // Granular Permissions State
  const [userPermissions, setUserPermissions] = useState({});

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setSelectedUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      status: u.status,
      avatar: u.avatar,
    });
    setIsUserModalOpen(true);
  };

  const handleOpenPermissions = (u) => {
    setSelectedUser(u);
    setUserPermissions(u.permissions ? JSON.parse(JSON.stringify(u.permissions)) : {});
    setIsPermModalOpen(true);
  };

  const handleTogglePermission = (resource, action) => {
    setUserPermissions((prev) => {
      const currentResActions = prev[resource] ? [...prev[resource]] : [];
      const hasAction = currentResActions.includes(action);
      const nextActions = hasAction
        ? currentResActions.filter((a) => a !== action)
        : [...currentResActions, action];

      return {
        ...prev,
        [resource]: nextActions,
      };
    });
  };

  const handleSavePermissions = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u._id === selectedUser._id ? { ...u, permissions: userPermissions } : u
      )
    );
    setIsPermModalOpen(false);
    toast.success(`Updated permissions for ${selectedUser.name}!`);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? { ...u, name: formData.name, email: formData.email, role: formData.role, status: formData.status }
            : u
        )
      );
      toast.success('User updated successfully!');
    } else {
      const newU = {
        _id: `u-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        joined: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        permissions: {},
      };
      setUsers((prev) => [newU, ...prev]);
      toast.success('User created successfully!');
    }
    setIsUserModalOpen(false);
  };

  const handleToggleUserStatus = () => {
    if (!selectedUser) return;
    const nextStatus = selectedUser.status === 'Active' ? 'Inactive' : 'Active';
    setUsers((prev) =>
      prev.map((u) =>
        u._id === selectedUser._id ? { ...u, status: nextStatus } : u
      )
    );
    setIsStatusModalOpen(false);
    toast.success(`User marked as ${nextStatus}.`);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        if (!matchName && !matchEmail) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HiOutlineUsers className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              User & Access Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Provision user accounts, assign faculty roles, configure resource permissions, and manage account statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 self-start sm:self-center"
        >
          <HiOutlineUserPlus className="h-5 w-5" />
          Create User
        </button>
      </div>

      {/* Stats Breakdown Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs dark:border-gray-800 dark:bg-gray-850">
          <p className="text-[10px] uppercase font-bold text-gray-400">Total Users</p>
          <p className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs dark:border-gray-800 dark:bg-gray-850">
          <p className="text-[10px] uppercase font-bold text-indigo-600">Students</p>
          <p className="mt-1 text-xl font-extrabold text-indigo-600">
            {users.filter((u) => u.role === 'student').length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs dark:border-gray-800 dark:bg-gray-850">
          <p className="text-[10px] uppercase font-bold text-emerald-600">Instructors</p>
          <p className="mt-1 text-xl font-extrabold text-emerald-600">
            {users.filter((u) => u.role === 'instructor').length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs dark:border-gray-800 dark:bg-gray-850">
          <p className="text-[10px] uppercase font-bold text-purple-600">Staff / Content</p>
          <p className="mt-1 text-xl font-extrabold text-purple-600">
            {users.filter((u) => ['content_manager', 'moderator', 'admin'].includes(u.role)).length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs dark:border-gray-800 dark:bg-gray-850">
          <p className="text-[10px] uppercase font-bold text-emerald-600">Active Accounts</p>
          <p className="mt-1 text-xl font-extrabold text-emerald-600">
            {users.filter((u) => u.status === 'Active').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="content_manager">Content Manager</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive / Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-850">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-semibold dark:bg-gray-800/60 dark:border-gray-700">
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Joined</th>
                <th className="px-6 py-3.5">Last Active</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold uppercase text-[10px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-400">{u.joined}</td>
                  <td className="px-6 py-4 font-medium">{u.lastActive}</td>

                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenPermissions(u)}
                        className="rounded-lg p-1 text-gray-400 hover:text-indigo-600"
                        title="Edit Permissions Matrix"
                      >
                        <HiOutlineShieldCheck className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(u)}
                        className="rounded-lg p-1 text-gray-400 hover:text-indigo-600"
                        title="Edit User Info"
                      >
                        <HiOutlinePencilSquare className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(u);
                          setIsStatusModalOpen(true);
                        }}
                        className={`rounded-lg p-1 ${
                          u.status === 'Active'
                            ? 'text-gray-400 hover:text-red-600'
                            : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                        title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {u.status === 'Active' ? (
                          <HiOutlineXCircle className="h-4 w-4" />
                        ) : (
                          <HiOutlineCheckCircle className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={selectedUser ? 'Edit User Details' : 'Create New User'}
        size="md"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {!selectedUser && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Initial Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Temporary secure password"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="content_manager">Content Manager</option>
                <option value="moderator">Moderator</option>
                <option value="admin">System Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Save User
            </button>
          </div>
        </form>
      </Modal>

      {/* GRANULAR PERMISSIONS MODAL (MATRIX) */}
      <Modal
        isOpen={isPermModalOpen}
        onClose={() => setIsPermModalOpen(false)}
        title={`Custom Permissions: ${selectedUser?.name}`}
        size="lg"
      >
        <form onSubmit={handleSavePermissions} className="space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Override role permissions with individual capability overrides on specific resource types.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold uppercase">
                <tr>
                  <th className="p-3">Resource</th>
                  {ACTION_LIST.map((action) => (
                    <th key={action} className="p-3 text-center">{action}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                {RESOURCE_LIST.map((resource) => (
                  <tr key={resource} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="p-3 font-bold capitalize">{resource}</td>
                    {ACTION_LIST.map((action) => {
                      const isChecked = userPermissions[resource]?.includes(action);
                      return (
                        <td key={action} className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={Boolean(isChecked)}
                            onChange={() => handleTogglePermission(resource, action)}
                            className="h-4 w-4 text-indigo-600 rounded"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsPermModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Save Permissions Matrix
            </button>
          </div>
        </form>
      </Modal>

      {/* Deactivate / Activate Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Confirm Account Status Change"
        size="sm"
      >
        <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300">
          <p>
            Are you sure you want to{' '}
            {selectedUser?.status === 'Active' ? 'deactivate' : 'reactivate'}{' '}
            <strong className="text-gray-900 dark:text-white">{selectedUser?.name}</strong>'s access?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleToggleUserStatus}
              className={`rounded-xl px-4 py-1.5 font-semibold text-white ${
                selectedUser?.status === 'Active'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
