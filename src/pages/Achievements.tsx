import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { getUserAchievements, getLeaderboard, getBadgeById, Badge, LeaderboardEntry } from '../lib/achievements';

export default function Achievements() {
  const [user] = useState(auth.currentUser);
  const [achievements, setAchievements] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (user) {
      // 获取用户成就
      const userAchievements = getUserAchievements(user.uid);
      setAchievements(userAchievements);

      // 获取用户徽章详情
      const badges = userAchievements.badges.map((badge: any) => {
        return getBadgeById(badge.badgeId);
      }).filter((badge: any) => badge !== undefined);
      setUserBadges(badges);

      // 获取排行榜
      setLeaderboard(getLeaderboard());
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">请先登录</p>
          <Link
            to="/login"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  if (!achievements) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-200 text-gray-800';
      case 'uncommon':
        return 'bg-green-200 text-green-800';
      case 'rare':
        return 'bg-blue-200 text-blue-800';
      case 'epic':
        return 'bg-purple-200 text-purple-800';
      case 'legendary':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                数据分析学习平台
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-gray-700 hover:text-indigo-600">
                首页
              </Link>
              <Link to="/courses" className="text-sm text-gray-700 hover:text-indigo-600">
                课程
              </Link>
              <Link to="/achievements" className="text-sm text-indigo-600 font-medium">
                成就
              </Link>
              <Link to="/profile" className="text-sm text-gray-700 hover:text-indigo-600">
                个人中心
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 用户成就概览 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">我的成就</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">{achievements.level}</div>
              <div className="text-sm text-gray-600 mt-1">等级</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">{achievements.points}</div>
              <div className="text-sm text-gray-600 mt-1">积分</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">{achievements.badges.length}</div>
              <div className="text-sm text-gray-600 mt-1">徽章</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">{Math.round(achievements.totalLearningTime / 60)}</div>
              <div className="text-sm text-gray-600 mt-1">学习小时</div>
            </div>
          </div>
        </div>

        {/* 徽章列表 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">我的徽章</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userBadges.map((badge) => (
              <div key={badge.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity === 'common' ? '普通' : 
                     badge.rarity === 'uncommon' ? '优秀' : 
                     badge.rarity === 'rare' ? '稀有' : 
                     badge.rarity === 'epic' ? '史诗' : '传说'}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                <p className="text-xs text-gray-500">{badge.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 排行榜 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">排行榜</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    等级
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    积分
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry) => (
                  <tr key={entry.userId} className={entry.username === user.email ? 'bg-indigo-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.rank}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.level}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.points}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2026 数据分析学习平台. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
}