import React, { useState } from 'react';

interface ResultTab {
  id: string;
  label: string;
  type: 'table' | 'chart' | 'text' | 'markdown';
}

interface AnalysisResultProps {
  result: any;
  tabs: ResultTab[];
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'text');

  const renderContent = () => {
    if (!result) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          点击"运行"按钮执行代码
        </div>
      );
    }

    const activeTabConfig = tabs.find(t => t.id === activeTab);
    
    if (result.error) {
      return (
        <div className="p-4 text-red-600 bg-red-50">
          <h3 className="font-bold mb-2">执行错误:</h3>
          <pre className="whitespace-pre-wrap">{result.stderr || '未知错误'}</pre>
        </div>
      );
    }

    return (
      <div className="p-4 overflow-auto">
        {result.stdout && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">输出:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">{result.stdout}</pre>
          </div>
        )}
        {result.stderr && (
          <div className="mb-4 text-orange-600">
            <h3 className="font-bold mb-2">警告:</h3>
            <pre className="bg-orange-50 p-3 rounded text-sm whitespace-pre-wrap">{result.stderr}</pre>
          </div>
        )}
        <div className="text-gray-500">当前标签: {activeTabConfig?.label}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {tabs.length > 0 && (
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 bg-white">
        {renderContent()}
      </div>
    </div>
  );
};
