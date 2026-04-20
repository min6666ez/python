import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { courses } from '../lib/courses';

// 模拟Pyodide加载
const loadPyodide = async () => {
  // 实际项目中，这里会加载真实的Pyodide
  // 为了演示，我们返回一个模拟对象
  return {
    runPython: async (code: string) => {
      try {
        // 简单的代码执行模拟
        if (code.includes('print')) {
          const match = code.match(/print\((.*)\)/);
          if (match) {
            return match[1].replace(/['"]/g, '');
          }
        }
        return '代码执行成功';
      } catch (error) {
        return `错误: ${error}`;
      }
    }
  };
};

export default function Lesson() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    // 查找课程和课时
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      // 查找课时
      for (const module of foundCourse.modules) {
        const foundLesson = module.lessons.find((l: any) => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
          if (foundLesson.codeExample) {
            setCode(foundLesson.codeExample);
          }
          break;
        }
      }
    }

    // 加载Pyodide
    const initPyodide = async () => {
      pyodideRef.current = await loadPyodide();
    };
    initPyodide();
  }, [courseId, lessonId]);

  const handleRunCode = async () => {
    if (!pyodideRef.current) return;

    setIsRunning(true);
    setOutput('运行中...');

    try {
      const result = await pyodideRef.current.runPython(code);
      setOutput(result);
    } catch (error) {
      setOutput(`错误: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">课时不存在</h1>
          <Link
            to={`/course/${courseId}`}
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            返回课程详情
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

      {/* 课程内容 */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 面包屑导航 */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600">首页</Link> → 
          <Link to="/courses" className="hover:text-indigo-600">课程</Link> → 
          <Link to={`/course/${courseId}`} className="hover:text-indigo-600">{course.title}</Link> → 
          <span className="text-gray-700">{lesson.title}</span>
        </div>

        {/* 课时内容 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{lesson.title}</h1>
          
          {/* 文本内容 */}
          {lesson.type === 'text' && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{lesson.content}</p>
            </div>
          )}

          {/* 代码内容 */}
          {lesson.type === 'code' && (
            <div className="space-y-4">
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700">{lesson.content}</p>
              </div>
              
              {/* 代码编辑器 */}
              <div className="border rounded-md overflow-hidden">
                <CodeMirror
                  value={code}
                  onChange={(value) => setCode(value)}
                  extensions={[python(), oneDark]}
                  className="min-h-[300px]"
                />
              </div>
              
              {/* 运行按钮和输出 */}
              <div className="space-y-4">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                >
                  {isRunning ? '运行中...' : '运行代码'}
                </button>
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">运行结果：</h3>
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap">{output}</pre>
                </div>
              </div>
            </div>
          )}

          {/* 视频内容 */}
          {lesson.type === 'video' && (
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">视频播放器 - 即将上线</p>
              </div>
            </div>
          )}
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            上一课
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            下一课
          </button>
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