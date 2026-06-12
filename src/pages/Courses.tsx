import { useState } from 'react';
import { Link } from 'react-router-dom';
import { courses, Course } from '../lib/courses';
import { Navbar, Footer } from '../components/Navigation';
import { auth } from '../lib/firebase';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';

export default function Courses() {
  const user = auth.currentUser;
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
      <Navbar user={user} />
      
      {/* 主内容 */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-24">
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
                    ? 'bg-primary text-white'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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

      <Footer />
    </div>
  );
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  
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
    <Link to={`/course/${course.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group">
      <div className="h-48 overflow-hidden relative">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${getLevelColor(course.level)}`}>
          {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{course.description}</p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <BookOpen size={14} />
            <span>{totalLessons} 课时</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {course.modules.length} 个模块
          </span>
          <span className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            查看详情
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};