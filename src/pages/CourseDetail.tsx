import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../lib/courses';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const course = getCourseById(id || '');

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">课程不存在</h1>
          <Link
            to="/courses"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

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
              <Link to="/courses" className="text-sm text-indigo-600 font-medium">
                课程
              </Link>
              <Link to="/profile" className="text-sm text-gray-700 hover:text-indigo-600">
                个人中心
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 课程详情 */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 课程头部 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  course.level === 'beginner'
                    ? 'bg-green-100 text-green-800'
                    : course.level === 'intermediate'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">课程时长</span>
                  <p className="text-sm font-medium text-gray-900">{course.duration}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">模块数</span>
                  <p className="text-sm font-medium text-gray-900">{course.modules.length} 个模块</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">课时数</span>
                  <p className="text-sm font-medium text-gray-900">
                    {course.modules.reduce((total, module) => total + module.lessons.length, 0)} 课时
                  </p>
                </div>
              </div>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                开始学习
              </button>
            </div>
          </div>
        </div>

        {/* 课程内容 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">课程内容</h2>
          {course.modules.map((module) => (
            <div key={module.id} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{module.title}</h3>
              <div className="space-y-3">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                      {lesson.type === 'video' ? '📹' : lesson.type === 'code' ? '💻' : '📄'}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                      {lesson.duration && (
                        <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                      )}
                    </div>
                    <Link
                      to={`/course/${course.id}/lesson/${lesson.id}`}
                      className="flex-shrink-0 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      学习
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
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