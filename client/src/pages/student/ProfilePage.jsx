import React, { useState } from 'react';
import { HiUser, HiEnvelope, HiAcademicCap, HiShieldCheck, HiSparkles } from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth.js';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || 'Student');
  const [email] = useState(user?.email || 'student@eduplatform.com');
  const [targetExam, setTargetExam] = useState('JEE Advanced 2026');

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name });
    toast.success('Profile details updated successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Student Profile & Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your personal details, target goals, and exam preferences</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-indigo-100 ring-4 ring-indigo-500/20 dark:bg-indigo-900">
            {user?.avatar ? (
              <img src={user.avatar} alt="User Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-indigo-600">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h2>
            <p className="text-xs text-gray-500">{email}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <HiShieldCheck className="h-3.5 w-3.5" /> {user?.role?.toUpperCase() || 'STUDENT'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Email Address (Fixed)
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2.5 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Primary Target Exam
            </label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="JEE Advanced 2026">JEE Advanced 2026</option>
              <option value="NEET UG 2026">NEET UG 2026</option>
              <option value="UPSC CSE 2026">UPSC CSE 2026</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
