import React, { useState, useEffect, useCallback } from 'react';

interface PythonEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  onReset?: () => void;
  isExecuting?: boolean;
}

export const PythonEditor: React.FC<PythonEditorProps> = ({ 
  initialCode, 
  onRun, 
  onReset,
  isExecuting = false 
}) => {
  const [code, setCode] = useState(initialCode);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleRun = useCallback(() => {
    onRun(code);
  }, [code, onRun]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    if (onReset) {
      onReset();
    }
  }, [initialCode, onReset]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  // 计算代码行数
  const lines = code.split('\n');
  const maxLineNumberWidth = Math.max(String(lines.length).length, 2);

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      <div className="flex gap-1 p-2 bg-gray-800 items-center flex-wrap">
        <button
          onClick={handleRun}
          disabled={isExecuting}
          className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all"
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              运行中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              运行
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          重置
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          复制
        </button>
        <button
          onClick={() => setShowLineNumbers(!showLineNumbers)}
          className="px-4 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
          </svg>
          {showLineNumbers ? '隐藏行号' : '显示行号'}
        </button>
        <div className="ml-auto text-gray-400 text-xs px-2">
          Python 3
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* 行号区域 */}
        {showLineNumbers && (
          <div className="flex-none bg-gray-800 text-gray-500 font-mono text-sm select-none text-right border-r border-gray-700 overflow-hidden">
            <div className="py-4 px-2 space-y-0.5">
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {String(i + 1).padStart(maxLineNumberWidth, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 代码编辑区域 */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none leading-6"
          spellCheck={false}
          placeholder="// 在这里编写代码..."
        />
      </div>
    </div>
  );
};
