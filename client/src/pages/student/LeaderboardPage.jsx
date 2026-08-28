import React from 'react';
import { HiTrophy, HiStar, HiSparkles } from 'react-icons/hi2';

export const LeaderboardPage = () => {
  const leaders = [
    { rank: 1, name: 'Ananya Sharma', score: 2980, streak: 45, badge: 'Grandmaster' },
    { rank: 2, name: 'Rohan Mehra', score: 2890, streak: 38, badge: 'Master' },
    { rank: 3, name: 'Kabir Verma', score: 2840, streak: 31, badge: 'Master' },
    { rank: 4, name: 'You (Student)', score: 2650, streak: 14, badge: 'Expert', isCurrentUser: true },
    { rank: 5, name: 'Tanvi Joshi', score: 2610, streak: 20, badge: 'Expert' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">National Leaderboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Weekly student rankings based on practice consistency, accuracy, and test series scores</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-850">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-100 bg-gray-50 uppercase text-[10px] text-gray-500 dark:border-gray-800 dark:bg-gray-800">
            <tr>
              <th className="py-3.5 px-4 font-bold">Rank</th>
              <th className="py-3.5 px-4 font-bold">Student</th>
              <th className="py-3.5 px-4 font-bold">Tier Badge</th>
              <th className="py-3.5 px-4 font-bold">Streak</th>
              <th className="py-3.5 px-4 font-bold text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {leaders.map((ldr) => (
              <tr
                key={ldr.rank}
                className={`${
                  ldr.isCurrentUser
                    ? 'bg-indigo-50/60 font-bold dark:bg-indigo-950/40'
                    : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/50'
                }`}
              >
                <td className="py-3.5 px-4">
                  {ldr.rank === 1 && <span className="text-amber-500 text-sm font-black">🥇 #1</span>}
                  {ldr.rank === 2 && <span className="text-gray-400 text-sm font-black">🥈 #2</span>}
                  {ldr.rank === 3 && <span className="text-amber-700 text-sm font-black">🥉 #3</span>}
                  {ldr.rank > 3 && <span className="text-gray-500 font-bold">#{ldr.rank}</span>}
                </td>
                <td className="py-3.5 px-4 text-gray-900 dark:text-white">
                  {ldr.name} {ldr.isCurrentUser && '(You)'}
                </td>
                <td className="py-3.5 px-4">
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {ldr.badge}
                  </span>
                </td>
                <td className="py-3.5 px-4">🔥 {ldr.streak} Days</td>
                <td className="py-3.5 px-4 text-right font-black text-indigo-600 dark:text-indigo-400">
                  {ldr.score.toLocaleString()} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
