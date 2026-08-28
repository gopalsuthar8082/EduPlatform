import React from 'react';
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
import { HiChartBar, HiArrowTrendingUp, HiSparkles } from 'react-icons/hi2';

export const PerformancePage = () => {
  const trendData = [
    { name: 'Week 1', score: 62, avg: 58 },
    { name: 'Week 2', score: 68, avg: 60 },
    { name: 'Week 3', score: 74, avg: 62 },
    { name: 'Week 4', score: 81, avg: 64 },
    { name: 'Week 5', score: 86, avg: 66 },
    { name: 'Week 6', score: 92, avg: 68 },
  ];

  const subjectData = [
    { subject: 'Calculus', score: 90 },
    { subject: 'Mechanics', score: 78 },
    { subject: 'Organic Chem', score: 84 },
    { subject: 'Optics', score: 86 },
    { subject: 'Algebra', score: 94 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Performance & Growth Analytics</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Detailed metric breakdowns, accuracy trends, and subject-wise mastery</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Weekly Score Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} domain={[40, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" name="Your Score (%)" stroke="#4f46e5" strokeWidth={3} />
                <Line type="monotone" dataKey="avg" name="Batch Average" stroke="#9ca3af" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Subject Mastery Level</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="subject" fontSize={11} />
                <YAxis fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" name="Mastery %" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
