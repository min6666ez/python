import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataAnalysisProjects } from '../lib/dataAnalysisProjects';
import { PythonEditor } from '../components/PythonEditor';
import { AnalysisResult } from '../components/AnalysisResult';

export const DataAnalysisProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [executionResult, setExecutionResult] = useState<any>(null);

  const project = dataAnalysisProjects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">项目未找到</h1>
          <Link to="/data-analysis" className="text-blue-600 hover:underline">
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/data-analysis" className="text-blue-600 hover:underline flex items-center gap-2">
              ← 返回项目列表
            </Link>
            <div className="flex gap-4">
              {prevProject && (
                <Link to={`/data-analysis/${prevProject.id}`} className="text-gray-600 hover:text-gray-800">
                  ← 上一个
                </Link>
              )}
              {nextProject && (
                <Link to={`/data-analysis/${nextProject.id}`} className="text-gray-600 hover:text-gray-800">
                  下一个 →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-gray-300">#{project.order}</span>
                <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
              </div>
              <p className="text-gray-600">{project.shortDescription}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">预计时间:</span>
              <div className="font-medium">{project.estimatedTime} 分钟</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag.id}
                className={`px-3 py-1 rounded-full text-xs ${tag.color} text-white`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">学习目标</h3>
              <ul className="list-disc list-inside text-gray-600">
                {project.learningObjectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">前置知识</h3>
              <ul className="list-disc list-inside text-gray-600">
                {project.prerequisites.map((pre, idx) => (
                  <li key={idx}>{pre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 400px)' }}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="font-medium">Python 编辑器</h3>
            </div>
            <PythonEditor
              initialCode={project.starterCode}
              onRun={setExecutionResult}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="font-medium">执行结果</h3>
            </div>
            <AnalysisResult result={executionResult} tabs={project.resultTabs} />
          </div>
        </div>

        {project.tasks && project.tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="font-semibold mb-4">练习任务</h3>
            <div className="space-y-3">
              {project.tasks.map((task, idx) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium">{task.description}</p>
                    {task.hint && (
                      <p className="text-sm text-gray-500 mt-1">💡 提示: {task.hint}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
