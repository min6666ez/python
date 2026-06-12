import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { courses, Course, Lesson as LessonType } from '../lib/courses';
import { Navbar, Breadcrumbs, Footer } from '../components/Navigation';
import { auth } from '../lib/firebase';
import { ArrowLeft, ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';

// 模拟Pyodide加载
const loadPyodide = async () => {
  return {
    runPython: async (code: string) => {
      try {
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

interface PyodideInstance {
  runPython: (code: string) => Promise<string>;
}

export default function Lesson() {
  const user = auth.currentUser;
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [prevLessonId, setPrevLessonId] = useState<string | null>(null);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const pyodideRef = useRef<PyodideInstance | null>(null);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      
      const allLessons: LessonType[] = [];
      for (const module of foundCourse.modules) {
        allLessons.push(...module.lessons);
      }
      
      const currentIndex = allLessons.findIndex(l => l.id === lessonId);
      
      if (currentIndex > 0) {
        setPrevLessonId(allLessons[currentIndex - 1].id);
      } else {
        setPrevLessonId(null);
      }
      
      if (currentIndex < allLessons.length - 1) {
        setNextLessonId(allLessons[currentIndex + 1].id);
      } else {
        setNextLessonId(null);
      }
      
      const foundLesson = allLessons[currentIndex];
      if (foundLesson) {
        setLesson(foundLesson);
        if (foundLesson.codeExample) {
          setCode(foundLesson.codeExample);
        }
      }
    }

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
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="min-h-[60vh] flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">课时不存在</h1>
            <Link
              to={`/course/${courseId}`}
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              返回课程详情
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      {/* 课程内容 */}
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-24">
        {/* 面包屑导航 */}
        <Breadcrumbs items={[
          { label: '首页', path: '/' },
          { label: '课程', path: '/courses' },
          { label: course.title, path: `/course/${courseId}` },
          { label: lesson.title }
        ]} />

        {/* 课时内容 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{lesson.title}</h1>
          
          {/* 文本内容 */}
          {lesson.type === 'text' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">{lesson.content}</p>
            </div>
          )}

          {/* 代码内容 */}
          {lesson.type === 'code' && (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{lesson.content}</p>
              </div>
              
              {/* 代码编辑器 */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Python 代码</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCode(lesson?.codeExample || '')}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      重置代码
                    </button>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 min-h-[350px] resize-none focus:outline-none border-0"
                  spellCheck={false}
                  placeholder="输入你的 Python 代码..."
                />
              </div>
              
              {/* 运行按钮和输出 */}
              <div className="space-y-4">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      运行中...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      运行代码
                    </>
                  )}
                </button>
                
                {output && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      运行结果：
                    </h3>
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-4 rounded border border-gray-200 font-mono">{output}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 视频内容 */}
          {lesson.type === 'video' && (
            <div className="mb-4">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">视频播放器 - 即将上线</p>
              </div>
            </div>
          )}
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-md p-6">
          <div>
            {prevLessonId ? (
              <Link
                to={`/course/${courseId}/lesson/${prevLessonId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} />
                上一课
              </Link>
            ) : (
              <Link
                to={`/course/${courseId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={20} />
                返回课程
              </Link>
            )}
          </div>
          <div className="text-center text-sm text-gray-500">
            {prevLessonId && nextLessonId && "继续学习下一课"}
          </div>
          <div>
            {nextLessonId ? (
              <Link
                to={`/course/${courseId}/lesson/${nextLessonId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                下一课
                <ChevronRight size={20} />
              </Link>
            ) : (
              <Link
                to={`/course/${courseId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                完成课程
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
