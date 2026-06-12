import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { getUserAchievements, getLeaderboard, getBadgeById, Badge, LeaderboardEntry, UserAchievement } from '../lib/achievements';
import { Navbar, Footer } from '../components/Navigation';
import { Trophy, Star, Clock, Award, Medal } from 'lucide-react';

export default function Achievements() {
  const user = auth.currentUser;
  const [achievements, setAchievements] = useState<UserAchievement | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (user) {
      const userAchievements = getUserAchievements(user.uid);
      setAchievements(userAchievements);

      const badges = userAchievements.badges.map((badge) => {
        return getBadgeById(badge.badgeId);
      }).filter((badge): badge is Badge => badge !== undefined);
      setUserBadges(badges);

      setLeaderboard(getLeaderboard());
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="min-h-[60vh] flex items-center justify-center pt-24">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">请先登录查看你的成就</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
            >
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!achievements) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="min-h-[60vh] flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'uncommon':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'rare':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'epic':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'legendary':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = [
    { icon: Trophy, label: '等级', value: achievements.level, color: 'from-primary to-blue-400' },
    { icon: Star, label: '积分', value: achievements.points, color: 'from-yellow-400 to-orange-400' },
    { icon: Award, label: '徽章', value: achievements.badges.length, color: 'from-purple-400 to-pink-400' },
    { icon: Clock, label: '学习小时', value: Math.round(achievements.totalLearningTime / 60), color: 'from-green-400 to-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      {/* 主内容 */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-24">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">我的成就</h1>
          <p className="text-gray-600">追踪你的学习进度，解锁更多成就</p>
        </div>

        {/* 用户成就概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 徽章列表 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Medal className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">我的徽章</h2>
            <span className="text-sm text-gray-500">({userBadges.length} 个)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userBadges.map((badge) => (
              <div key={badge.id} className={`border-2 rounded-lg p-5 hover:shadow-md transition-all ${getRarityColor(badge.rarity)}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{badge.icon}</span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-white shadow-sm">
                    {badge.rarity === 'common' ? '普通' : 
                     badge.rarity === 'uncommon' ? '优秀' : 
                     badge.rarity === 'rare' ? '稀有' : 
                     badge.rarity === 'epic' ? '史诗' : '传说'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-700 mb-2">{badge.description}</p>
                <p className="text-xs text-gray-500">达成条件：{badge.condition}</p>
              </div>
            ))}
            {userBadges.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p>还没有获得任何徽章</p>
                <p className="text-sm mt-1">继续学习解锁更多成就！</p>
              </div>
            )}
          </div>
        </div>

        {/* 排行榜 */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">排行榜</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    排名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    用户名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    等级
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    积分
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry) => (
                  <tr key={entry.userId} className={`${entry.username === user.email ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          entry.rank === 2 ? 'bg-gray-100 text-gray-700' :
                          entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {entry.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.username === user.email ? `${entry.username} (你)` : entry.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                          Level {entry.level}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{entry.points}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
