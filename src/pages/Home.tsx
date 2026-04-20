import { User } from "firebase/auth";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { courses } from '../lib/courses';
import { getUserAchievements } from '../lib/achievements';
import { Book, Award, Clock, Star, ChevronRight, User as UserIcon, Menu, X } from 'lucide-react';

interface HomeProps {
  user: User | null;
}

export default function Home({ user }: HomeProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any>(null);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 使用导入的课程数据
    setCourses(courses);
    
    // 模拟最近学习的课程
    setRecentCourses(courses.slice(0, 3));

    // 获取用户成就
    if (user) {
      const userAchievements = getUserAchievements(user.uid);
      setAchievements(userAchievements);
    }

    // 监听滚动事件
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className={`text-xl font-bold font-inter transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-white drop-shadow-md'}`}>
                数据分析学习平台
              </Link>
            </div>
            
            {/* 桌面导航 */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-primary border-b-2 border-accent' : 'text-white hover:text-secondary drop-shadow-sm'}`}>
                首页
              </Link>
              <Link to="/courses" className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-secondary drop-shadow-sm'}`}>
                课程
              </Link>
              <Link to="/data-analysis" className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-secondary drop-shadow-sm'}`}>
                实战项目
              </Link>
              <Link to="/achievements" className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-secondary drop-shadow-sm'}`}>
                成就
              </Link>
              {user ? (
                <Link to="/profile" className={`text-sm font-medium transition-colors duration-300 flex items-center ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-secondary drop-shadow-sm'}`}>
                  <UserIcon size={16} className={`mr-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                  {user.email?.split('@')[0]}
                </Link>
              ) : (
                <>
                  <Link to="/login" className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-secondary drop-shadow-sm'}`}>
                    登录
                  </Link>
                  <Link to="/register" className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-secondary drop-shadow-sm'}`}>
                    注册
                  </Link>
                </>
              )}
            </div>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-secondary'}`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* 移动端导航菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute w-full">
            <div className="px-4 py-4 space-y-4">
              <Link 
                to="/" 
                className="block text-sm font-medium text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                to="/courses" 
                className="block text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                课程
              </Link>
              <Link 
                to="/data-analysis" 
                className="block text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                实战项目
              </Link>
              <Link 
                to="/achievements" 
                className="block text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                成就
              </Link>
              {user ? (
                <Link 
                  to="/profile" 
                  className="block text-sm font-medium text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  个人中心
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block text-sm font-medium text-gray-700 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    登录
                  </Link>
                  <Link 
                    to="/register" 
                    className="block text-sm font-medium text-gray-700 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 英雄区 */}
      <div className="wave-bg min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                掌握数据分析技能，<br />
                <span className="text-secondary">开启职业新篇章</span>
              </h1>
              <p className="text-xl text-white mb-8 max-w-lg drop-shadow-md">
                专为商务数据分析与应用专业学生设计的在线学习平台，提供完整的课程体系和互动式学习体验
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/courses"
                  className="btn-primary flex items-center"
                >
                  浏览课程
                  <ChevronRight size={18} className="ml-2" />
                </Link>
                <Link
                  to="/data-analysis"
                  className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-medium flex items-center transition-colors duration-300"
                >
                  实战项目
                  <ChevronRight size={18} className="ml-2" />
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="btn-outline text-white border-white hover:bg-white hover:text-primary"
                  >
                    立即注册
                  </Link>
                )}
              </div>
              <div className="mt-12 flex items-center space-x-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      alt="用户头像"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="text-white font-medium">4.9/5</div>
                  <div className="flex items-center text-yellow-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-secondary rounded-2xl opacity-20 blur-xl"></div>
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20dashboard%20with%20charts%20and%20graphs%20on%20multiple%20screens%20in%20modern%20office%20setting&image_size=landscape_16_9"
                  alt="数据分析" 
                  className="w-full h-auto rounded-2xl shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-gray-600">学生满意度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 特色功能 */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">平台特色</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们提供全方位的学习体验，帮助您掌握数据分析技能并应用到实际业务中
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Book size={32} className="text-primary" />,
              title: "完整的课程体系",
              description: "从基础到高级的数据分析课程，涵盖Python、商务分析等多个领域"
            },
            {
              icon: <Award size={32} className="text-secondary" />,
              title: "互动式学习模块",
              description: "实时代码编辑器，即时反馈，让学习更加生动有趣"
            },
            {
              icon: <Clock size={32} className="text-accent" />,
              title: "学练测评一体化",
              description: "课程、练习、测试无缝衔接，全面提升学习效果"
            },
            {
              icon: <Star size={32} className="text-warning" />,
              title: "成就激励系统",
              description: "徽章、排行榜等激励机制，让学习更有动力"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md card-hover"
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 实战项目 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">数据分析实战训练营</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              10个循序渐进的实战项目，从数据清洗到用户分群，掌握完整的数据分析技能
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                id: 'retail-data-cleaning',
                number: 1,
                title: '零售业销售数据清洗',
                description: '学习处理重复记录、缺失值和异常值，掌握数据预处理核心技能',
                difficulty: '入门',
                color: 'bg-green-100 text-green-800'
              },
              {
                id: 'market-basket-apriori',
                number: 4,
                title: '购物篮关联规则挖掘',
                description: '使用Apriori算法发现商品购买关联，为营销策略提供数据支持',
                difficulty: '进阶',
                color: 'bg-yellow-100 text-yellow-800'
              },
              {
                id: 'complete-operations-dashboard',
                number: 10,
                title: '完整用户运营分析看板',
                description: '综合运用所有技能，完成端到端的用户运营分析',
                difficulty: '专家',
                color: 'bg-red-100 text-red-800'
              }
            ].map((project, index) => (
              <Link
                key={project.id}
                to={`/data-analysis/${project.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 card-hover"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-gray-200">#{project.number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.color}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/data-analysis"
              className="btn-primary inline-flex items-center"
            >
              查看全部项目
              <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* 课程推荐 */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">推荐课程</h2>
            <Link
              to="/courses"
              className="text-primary font-medium hover:text-primary-light flex items-center"
            >
              查看全部
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course, index) => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md card-hover fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                    {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-gray-700 font-medium">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {course.duration} 分钟
                    </span>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="block w-full py-2 px-4 bg-primary text-white rounded-lg text-center font-medium hover:bg-primary-light transition-colors duration-300"
                  >
                    开始学习
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 学习进度 */}
      {user && achievements && (
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">我的学习进度</h2>
            <p className="text-xl text-gray-600">跟踪您的学习旅程，见证每一步成长</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl font-bold text-primary">{achievements.level}</div>
                </div>
                <div className="text-gray-600">等级</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl font-bold text-secondary">{achievements.points}</div>
                </div>
                <div className="text-gray-600">积分</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl font-bold text-accent">{achievements.badges.length}</div>
                </div>
                <div className="text-gray-600">徽章</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl font-bold text-success">{Math.round(achievements.totalLearningTime / 60)}</div>
                </div>
                <div className="text-gray-600">学习小时</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">最近学习的课程</h3>
            <div className="space-y-6">
              {recentCourses.map((course) => {
                const progress = Math.floor(Math.random() * 100);
                return (
                  <div key={course.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-20 h-20 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <div className="w-full md:w-64 bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-secondary h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{progress}% 完成</div>
                      </div>
                    </div>
                    <Link
                      to={`/course/${course.id}`}
                      className="btn-secondary flex items-center"
                    >
                      继续学习
                      <ChevronRight size={16} className="ml-2" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 drop-shadow-sm">数据分析学习平台</h3>
              <p className="text-blue-200 mb-4">
                专为商务数据分析与应用专业学生设计的在线学习平台
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-secondary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="text-white hover:text-secondary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                </a>
                <a href="#" className="text-white hover:text-secondary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 drop-shadow-sm">课程</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-blue-100 hover:text-white transition-colors">所有课程</Link></li>
                <li><Link to="/courses" className="text-blue-100 hover:text-white transition-colors">Python基础</Link></li>
                <li><Link to="/courses" className="text-blue-100 hover:text-white transition-colors">商务分析</Link></li>
                <li><Link to="/courses" className="text-blue-100 hover:text-white transition-colors">数据可视化</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 drop-shadow-sm">资源</h4>
              <ul className="space-y-2">
                <li><Link to="/achievements" className="text-blue-100 hover:text-white transition-colors">成就系统</Link></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">学习指南</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">常见问题</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 drop-shadow-sm">订阅更新</h4>
              <p className="text-blue-100 mb-4">获取最新课程和学习资源</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="您的邮箱" 
                  className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
                />
                <button className="bg-accent text-white px-4 py-2 rounded-r-lg hover:bg-accent-light transition-colors">
                  订阅
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
            <p>© 2026 数据分析学习平台. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}