import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Navbar, Footer } from '../components/Navigation';
import { Mail, Calendar, Clock, LogOut, User, Award, BookOpen, Trophy } from 'lucide-react';
import { getUserAchievements } from '../lib/achievements';

const Profile = () => {
  const [user] = useState(auth.currentUser);
  const achievements = user ? getUserAchievements(user.uid) : null;

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="min-h-[60vh] flex items-center justify-center pt-24">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">请先登录</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-24">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.email?.split('@')[0]}</h2>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">账户信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">邮箱地址</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-primary mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">注册时间</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('zh-CN') : '未知'}
                  </dd>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">最后登录</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('zh-CN') : '未知'}
                  </dd>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Award className="w-6 h-6 text-primary mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">用户ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 truncate">{user.uid}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 学习统计 */}
        {achievements && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">学习统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{achievements.level}</div>
                <div className="text-sm text-gray-500">等级</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{achievements.points}</div>
                <div className="text-sm text-gray-500">积分</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{achievements.badges.length}</div>
                <div className="text-sm text-gray-500">徽章</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{Math.round(achievements.totalLearningTime / 60)}</div>
                <div className="text-sm text-gray-500">学习小时</div>
              </div>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">快捷操作</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/courses"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors group"
            >
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-primary transition-colors">我的课程</div>
                <div className="text-sm text-gray-500">查看学习进度</div>
              </div>
            </Link>
            
            <Link
              to="/achievements"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors group"
            >
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-primary transition-colors">我的成就</div>
                <div className="text-sm text-gray-500">查看徽章和排行</div>
              </div>
            </Link>
            
            <Link
              to="/data-analysis"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors group"
            >
              <Award className="w-8 h-8 text-primary" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-primary transition-colors">实战项目</div>
                <div className="text-sm text-gray-500">继续实战训练</div>
              </div>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              退出登录
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;