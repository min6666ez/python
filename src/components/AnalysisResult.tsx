import React, { useState } from 'react';

interface ResultTab {
  id: string;
  label: string;
  type: 'table' | 'chart' | 'text' | 'markdown';
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  result: any;
  error: boolean;
  images: string[];
}

interface AnalysisResultProps {
  result: ExecutionResult | null;
  tabs: ResultTab[];
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'output');

  const renderContent = () => {
    if (!result) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>点击"运行"按钮执行代码</p>
          </div>
        </div>
      );
    }

    if (result.error) {
      return (
        <div className="p-4 text-red-600 bg-red-50 h-full overflow-auto">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className="flex-1">
              <h3 className="font-bold mb-2">执行错误</h3>
              <pre className="whitespace-pre-wrap bg-red-100 p-3 rounded text-sm font-mono">{result.stderr || '未知错误'}</pre>
            </div>
          </div>
        </div>
      );
    }

    const hasImages = result.images && result.images.length > 0;
    const hasOutput = result.stdout && result.stdout.trim().length > 0;
    const hasWarning = result.stderr && result.stderr.trim().length > 0;

    return (
      <div className="p-4 overflow-auto h-full">
        {/* 输出内容 */}
        {hasOutput && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              输出
            </h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-60 overflow-auto">
              {result.stdout}
            </div>
          </div>
        )}

        {/* 警告内容 */}
        {hasWarning && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-orange-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              警告
            </h3>
            <div className="bg-orange-50 text-orange-700 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap border border-orange-200">
              {result.stderr}
            </div>
          </div>
        )}

        {/* 图表展示 */}
        {hasImages && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              图表 ({result.images.length})
            </h3>
            <div className="grid gap-4">
              {result.images.map((imgBase64, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <img 
                    src={`data:image/png;base64,${imgBase64}`}
                    alt={`图表 ${index + 1}`}
                    className="max-w-full h-auto rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!hasOutput && !hasWarning && !hasImages && (
          <div className="flex items-center justify-center h-40 text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              <p>代码执行成功，但无输出内容</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* 自定义标签页 */}
      {tabs.length > 0 && (
        <div className="flex border-b bg-gray-50 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary bg-white -mb-px'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 bg-gray-50">
        {renderContent()}
      </div>
    </div>
  );
};
