import { useParams, Link } from 'react-router-dom';
import { getCourseById, courses } from '../lib/courses';
import { dataAnalysisProjects } from '../lib/dataAnalysisProjects';
import { Navbar, Breadcrumbs, Footer } from '../components/Navigation';
import { auth } from '../lib/firebase';
import { ArrowRight, BookOpen, Clock, Users, BarChart3 } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const course = getCourseById(id || '');
  const user = auth.currentUser;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">课程不存在</h1>
          <Link
            to="/courses"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  
  // 获取相关实战项目
  const relatedProjects = dataAnalysisProjects.slice(0, 3);
  
  // 获取其他课程
  const otherCourses = courses.filter(c => c.id !== course.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      {/* 主内容 */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑 */}
          <div className="mb-6">
            <Breadcrumbs 
              items={[
                { label: '首页', path: '/' },
                { label: '课程', path: '/courses' },
                { label: course.title }
              ]}
            />
          </div>

          {/* 课程头部 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-2/5 relative">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.level === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : course.level === 'intermediate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
                  </span>
                </div>
              </div>
              <div className="p-8 md:w-3/5">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Clock size={16} />
                      课程时长
                    </div>
                    <p className="font-semibold text-gray-900">{course.duration}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <BookOpen size={16} />
                      课程模块
                    </div>
                    <p className="font-semibold text-gray-900">{course.modules.length} 个</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <BarChart3 size={16} />
                      课时数
                    </div>
                    <p className="font-semibold text-gray-900">{totalLessons} 课时</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Users size={16} />
                      课程评分
                    </div>
                    <p className="font-semibold text-gray-900">{course.rating} 分</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to={`/course/${course.id}/lesson/${course.modules[0]?.lessons[0]?.id}`}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    开始学习
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/data-analysis"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    查看实战项目
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 课程内容 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">课程内容</h2>
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                        {moduleIndex + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <span className="text-sm text-gray-500">{module.lessons.length} 课时</span>
                    </div>
                    <div className="ml-4 md:ml-11 space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lesson.id} 
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                              {lessonIndex + 1}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900">{lesson.title}</p>
                              {lesson.duration && (
                                <p className="text-xs text-gray-500">{lesson.duration}</p>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/course/${course.id}/lesson/${lesson.id}`}
                            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            学习
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 相关实战项目 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">相关实战项目</h2>
                  <Link to="/data-analysis" className="text-primary hover:text-primary/80 text-sm font-medium">
                    查看全部 →
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedProjects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/data-analysis/${project.id}`}
                      className="p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-200">#{project.order}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          project.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          project.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          project.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.difficulty === 'beginner' ? '入门' :
                           project.difficulty === 'intermediate' ? '进阶' :
                           project.difficulty === 'advanced' ? '高级' : '专家'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{project.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="lg:col-span-1">
              {/* 其他课程 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">其他课程</h3>
                <div className="space-y-4">
                  {otherCourses.map((c) => (
                    <Link
                      key={c.id}
                      to={`/course/${c.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={c.coverImage}
                        alt={c.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-primary transition-colors text-sm">
                          {c.title}
                        </p>
                        <p className="text-xs text-gray-500">{c.duration}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/courses"
                  className="block mt-4 text-center text-primary hover:text-primary/80 text-sm font-medium"
                >
                  查看全部课程 →
                </Link>
              </div>

              {/* 学习小贴士 */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-3">学习小贴士</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-light">•</span>
                    建议按课程顺序学习，打好基础
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-light">•</span>
                    每节课后完成练习题巩固知识
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-light">•</span>
                    结合实战项目加深理解
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-light">•</span>
                    遇到问题可查看参考答案
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
