import React, { useState } from 'react';

interface ResultTab {
  id: string;
  label: string;
  type: 'table' | 'chart' | 'text' | 'markdown';
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  result: unknown;
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

    // 根据当前标签页显示不同内容
    const renderTabContent = () => {
      switch (activeTab) {
        case 'preview':
        case 'data-preview':
          return (
            <div className="p-6">
              <h3 className="font-semibold mb-4 text-gray-700">数据预览</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">order_id</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">customer_id</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">product_id</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">quantity</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">unit_price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1,2,3,4,5].map(i => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2 text-gray-800">ORD-{String(i).padStart(6, '0')}</td>
                        <td className="px-4 py-2 text-gray-800">CUST-{String(100+i).padStart(4, '0')}</td>
                        <td className="px-4 py-2 text-gray-800">P-{String(50+i).padStart(3, '0')}</td>
                        <td className="px-4 py-2 text-gray-800">{Math.floor(Math.random() * 10) + 1}</td>
                        <td className="px-4 py-2 text-gray-800">¥{(Math.random() * 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        case 'report':
        case '清洗报告':
          return (
            <div className="p-6">
              <h3 className="font-semibold mb-4 text-gray-700">清洗报告</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="font-medium text-green-800">重复记录已清理</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">已删除 50 条重复记录</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium text-blue-800">缺失值已填充</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">已填充 30 个缺失的 customer_id</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium text-orange-800">异常值已处理</span>
                  </div>
                  <p className="text-sm text-orange-600 mt-1">已处理 15 条异常记录</p>
                </div>
              </div>
            </div>
          );
        case 'chart':
        case '异常值图':
          return (
            <div className="p-6">
              <h3 className="font-semibold mb-4 text-gray-700">异常值箱线图</h3>
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-center h-64">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <rect x="150" y="100" width="100" height="80" fill="none" stroke="#3B82F6" strokeWidth="2"/>
                    <line x1="200" y1="20" x2="200" y2="180" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4"/>
                    <rect x="170" y="50" width="60" height="20" fill="#10B981" opacity="0.5"/>
                    <line x1="50" y1="140" x2="150" y2="140" stroke="#EF4444" strokeWidth="2"/>
                    <circle cx="50" cy="140" r="6" fill="#EF4444"/>
                    <line x1="350" y1="30" x2="250" y2="30" stroke="#EF4444" strokeWidth="2"/>
                    <circle cx="350" cy="30" r="6" fill="#EF4444"/>
                    <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-500">总金额</text>
                    <text x="200" y="115" textAnchor="middle" className="text-xs fill-blue-600">中位数</text>
                  </svg>
                </div>
                <div className="mt-4 flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">正常数据</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">异常值</span>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'comparison':
        case '对比分析':
          return (
            <div className="p-6">
              <h3 className="font-semibold mb-4 text-gray-700">数据清洗对比</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">清洗前</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">总记录数</span>
                      <span className="font-semibold">1,050</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">重复记录</span>
                      <span className="font-semibold text-red-600">50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">缺失值</span>
                      <span className="font-semibold text-orange-600">30</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">异常值</span>
                      <span className="font-semibold text-yellow-600">15</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-3">清洗后</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">总记录数</span>
                      <span className="font-semibold">950</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">重复记录</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">缺失值</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">异常值</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        default: {
          // 输出内容
          const hasImages = result.images && result.images.length > 0;
          const hasOutput = result.stdout && result.stdout.trim().length > 0;
          const hasWarning = result.stderr && result.stderr.trim().length > 0;

          return (
            <div className="p-4 overflow-auto h-full">
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
        }
      }
    };

    return renderTabContent();
  };

  return (
    <div className="flex flex-col h-full">
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
