import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataAnalysisProjects } from '../lib/dataAnalysisProjects';
import { PythonEditor } from '../components/PythonEditor';
import { AnalysisResult } from '../components/AnalysisResult';
import { useProjectProgress } from '../hooks/useProjectProgress';
import { usePyodide } from '../contexts/PyodideContext';

export const DataAnalysisProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const { runPython } = usePyodide();

  const project = dataAnalysisProjects.find(p => p.id === projectId);
  const { completeTask, isTaskCompleted, getCompletedTasksCount } = useProjectProgress(projectId || '');

  // 当项目变化时重置状态
  useEffect(() => {
    setExecutionResult(null);
    setShowSolution(false);
    setShowComparison(false);
  }, [projectId]);

  // 处理代码运行
  const handleRunCode = useCallback(async (userCode: string) => {
    setExecutionResult({
      stdout: '正在执行代码...\n',
      stderr: '',
      result: null,
      error: false,
      images: []
    });
    
    try {
      const result = await runPython(userCode);
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        stdout: '',
        stderr: `执行出错: ${error}`,
        result: null,
        error: true,
        images: []
      });
    }
  }, [runPython]);

  // 处理重置
  const handleReset = useCallback(() => {
    setExecutionResult(null);
    setShowSolution(false);
    setShowComparison(false);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">项目未找到</h1>
          <Link to="/data-analysis" className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  const sortedProjects = [...dataAnalysisProjects].sort((a, b) => a.order - b.order);
  const currentIndex = sortedProjects.findIndex(p => p.id === projectId);
  const prevProject = currentIndex > 0 ? sortedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : null;

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = getCompletedTasksCount();
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 获取难度对应的颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '入门';
      case 'intermediate': return '进阶';
      case 'advanced': return '高级';
      case 'expert': return '专家';
      default: return difficulty;
    }
  };

  // 格式化代码显示（添加行号）
  const formatCodeWithLineNumbers = (code: string) => {
    const lines = code.split('\n');
    const maxLineNumWidth = String(lines.length).length;
    
    return lines.map((line, index) => {
      const lineNum = String(index + 1).padStart(maxLineNumWidth, ' ');
      return `${lineNum} | ${line}`;
    }).join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/data-analysis" className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              返回项目列表
            </Link>
            <div className="flex items-center gap-4">
              {prevProject && (
                <Link to={`/data-analysis/${prevProject.id}`} className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                  上一个
                </Link>
              )}
              {nextProject && (
                <Link to={`/data-analysis/${nextProject.id}`} className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">
                  下一个
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 项目头部信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-3xl font-bold text-gray-200">#{project.order}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
                  <p className="text-gray-600 mt-1">{project.shortDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {getDifficultyLabel(project.difficulty)}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {project.estimatedTime} 分钟
                </span>
                {totalTasks > 0 && (
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    {completedTasks}/{totalTasks} 任务
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 进度条 */}
          {totalTasks > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>学习进度</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag.id}
                className={`px-3 py-1 rounded-full text-sm ${tag.color} text-white`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                学习目标
              </h3>
              <ul className="space-y-2">
                {project.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                前置知识
              </h3>
              <ul className="space-y-2">
                {project.prerequisites.map((pre, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                    {pre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 编辑器和结果区域 */}
        <div className="mb-6">
          {/* 控制按钮 */}
          <div className="bg-white rounded-t-xl shadow-sm border-b p-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSolution(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !showSolution ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                练习模式
              </button>
              <button
                onClick={() => setShowSolution(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showSolution ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                查看答案
              </button>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showComparison ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                对比答案
              </button>
            </div>
          </div>

          {/* 编辑器区域 */}
          <div className="grid lg:grid-cols-2 gap-4 bg-white rounded-b-xl shadow-sm">
            {/* 左侧：用户编辑器 */}
            <div className="border-r">
              <div className="bg-gray-800 px-4 py-2 text-white text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2l6 4v12l-6 4-6-4V6l6-4z"/>
                </svg>
                您的代码
              </div>
              <PythonEditor
                initialCode={showSolution ? project.solutionCode : project.starterCode}
                onRun={handleRunCode}
                onReset={handleReset}
              />
            </div>

            {/* 右侧：参考答案对比 */}
            {showComparison && (
              <div>
                <div className="bg-blue-800 px-4 py-2 text-white text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2l7 3.5v9L10 18l-7-3.5v-9L10 2z"/>
                  </svg>
                  参考答案
                </div>
                <div className="flex flex-col h-[400px] bg-gray-900 rounded-br-xl overflow-hidden">
                  <div className="flex flex-1 overflow-hidden">
                    {/* 行号 */}
                    <div className="flex-none bg-gray-800 text-gray-500 font-mono text-sm select-none text-right border-r border-gray-700 overflow-auto">
                      <div className="py-4 px-2 space-y-0.5">
                        {project.solutionCode.split('\n').map((_, i) => (
                          <div key={i} className="leading-6">
                            {String(i + 1).padStart(2, ' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 代码内容 */}
                    <div className="flex-1 overflow-auto">
                      <pre className="p-4 font-mono text-sm text-gray-200 leading-6 whitespace-pre-wrap">
                        {project.solutionCode}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 执行结果 */}
          <div className="mt-4 bg-white rounded-xl shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b rounded-t-xl">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                执行结果
              </h3>
            </div>
            <div className="p-4">
              <AnalysisResult result={executionResult} tabs={project.resultTabs} />
            </div>
          </div>
        </div>

        {/* 练习任务区域 */}
        {project.tasks && project.tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                练习任务
              </h3>
              <span className="text-sm text-gray-500">
                {completedTasks}/{totalTasks} 已完成
              </span>
            </div>
            <div className="space-y-3">
              {project.tasks.map((task, idx) => {
                const isCompleted = isTaskCompleted(task.id);
                return (
                  <div 
                    key={task.id} 
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:border-primary'
                    }`}
                  >
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-300 hover:border-primary cursor-pointer'
                      }`}
                    >
                      {isCompleted && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                        {idx + 1}. {task.description}
                      </p>
                      {task.hint && (
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                          <span className="text-yellow-600">💡</span>
                          提示: {task.hint}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
