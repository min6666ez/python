import { useState } from 'react';
import { Link } from 'react-router-dom';
import { courses, Course } from '../lib/courses';

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { value: 'all', label: '全部课程' },
    { value: 'python', label: 'Python基础' },
    { value: 'data-analysis', label: '数据分析' },
    { value: 'visualization', label: '数据可视化' },
    { value: 'business-analysis', label: '商务分析' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">课程体系</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            从Python基础到商务数据分析，我们提供完整的课程体系，帮助你掌握数据分析的核心技能
          </p>
        </div>

        {/* 筛选和搜索 */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="flex-grow">
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 课程列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2026 数据分析学习平台. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
          </span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">{course.duration}</span>
          <span className="text-sm text-gray-500">
            {course.modules.reduce((total, module) => total + module.lessons.length, 0)} 课时
          </span>
        </div>
        <Link
          to={`/course/${course.id}`}
          className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          查看详情
        </Link>
      </div>
    </div>
  );
};