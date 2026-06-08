import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataAnalysisProjects } from '../lib/dataAnalysisProjects';
import { useAllProjectsProgress } from '../hooks/useProjectProgress';

export const DataAnalysisHome: React.FC = () => {
  const sortedProjects = [...dataAnalysisProjects].sort((a, b) => a.order - b.order);
  const allProgress = useAllProjectsProgress();
  const [totalProgress, setTotalProgress] = useState(0);

  // 计算总体进度
  useEffect(() => {
    let totalCompleted = 0;
    let totalTasks = 0;
    
    sortedProjects.forEach(project => {
      const projectTasks = project.tasks?.length || 0;
      totalTasks += projectTasks;
      
      const progress = allProgress[project.id];
      if (progress) {
        totalCompleted += progress.tasks.filter(t => t.completed).length;
      }
    });
    
    const percentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
    setTotalProgress(percentage);
  }, [allProgress, sortedProjects]);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProjectProgress = (projectId: string) => {
    const progress = allProgress[projectId];
    const project = sortedProjects.find(p => p.id === projectId);
    const totalTasks = project?.tasks?.length || 0;
    if (!progress || totalTasks === 0) return { completed: 0, total: totalTasks, percentage: 0 };
    
    const completed = progress.tasks.filter(t => t.completed).length;
    return { completed, total: totalTasks, percentage: Math.round((completed / totalTasks) * 100) };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">数据分析实战训练营</h1>
              <p className="text-xl opacity-90 mb-6">
                10个循序渐进的实战项目，从数据清洗到用户分群，掌握完整的数据分析技能
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span className="font-bold text-lg">{sortedProjects.length}</span>
                  <span>个项目</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  <span>从入门到精通</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                  <span>浏览器运行 Python</span>
                </div>
              </div>
            </div>
            {totalProgress > 0 && (
              <div className="bg-white/20 backdrop-blur rounded-xl p-6 ml-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{totalProgress}%</div>
                  <div className="text-sm opacity-90">总体进度</div>
                  <div className="mt-3 w-32 bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => {
            const progress = getProjectProgress(project.id);
            const isStarted = progress.completed > 0;
            const isCompleted = progress.percentage === 100;
            
            return (
              <Link
                key={project.id}
                to={`/data-analysis/${project.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-200">#{project.order}</span>
                    {isCompleted && (
                      <span className="bg-green-100 text-green-600 rounded-full p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty === 'beginner' ? '入门' : 
                     project.difficulty === 'intermediate' ? '进阶' : 
                     project.difficulty === 'advanced' ? '高级' : '专家'}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.shortDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={`px-2 py-1 rounded text-xs ${tag.color} text-white`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                
                {/* Progress Bar */}
                {progress.total > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{progress.completed}/{progress.total} 任务</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {project.estimatedTime}分钟
                  </span>
                  <span className={`font-medium flex items-center gap-1 ${isCompleted ? 'text-green-600' : 'text-primary'}`}>
                    {isCompleted ? '已完成' : isStarted ? '继续学习' : '开始学习'}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
