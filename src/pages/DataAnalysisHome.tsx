import React from 'react';
import { Link } from 'react-router-dom';
import { dataAnalysisProjects } from '../lib/dataAnalysisProjects';

export const DataAnalysisHome: React.FC = () => {
  const sortedProjects = [...dataAnalysisProjects].sort((a, b) => a.order - b.order);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">数据分析实战训练营</h1>
          <p className="text-xl opacity-90">
            10个循序渐进的实战项目，从数据清洗到用户分群，掌握完整的数据分析技能
          </p>
          <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold">{sortedProjects.length}</span>个项目
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">从</span>入门到精通
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <Link
              key={project.id}
              to={`/data-analysis/${project.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl font-bold text-gray-200">#{project.order}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty === 'beginner' ? '入门' : 
                   project.difficulty === 'intermediate' ? '进阶' : 
                   project.difficulty === 'advanced' ? '高级' : '专家'}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.shortDescription}</p>
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
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>⏱️ {project.estimatedTime}分钟</span>
                <span className="text-blue-600 font-medium">开始学习 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
