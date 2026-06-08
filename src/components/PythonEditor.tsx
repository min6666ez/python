import React, { useState, useEffect } from 'react';
import { usePyodide } from '../contexts/PyodideContext';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

interface PythonEditorProps {
  initialCode: string;
  onRun: (result: any) => void;
}

export const PythonEditor: React.FC<PythonEditorProps> = ({ initialCode, onRun }) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const { runPython, isLoading, loadProgress } = usePyodide();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleRun = async () => {
    if (isLoading) return;
    
    setIsRunning(true);
    try {
      const result = await runPython(code);
      onRun(result);
    } catch (error) {
      console.error('Error running code:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
  };

  const isDisabled = isLoading || isRunning;

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 bg-gray-800 items-center">
        <button
          onClick={handleRun}
          disabled={isDisabled}
          className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          title={isLoading ? `Python环境加载中: ${loadProgress}%` : undefined}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              加载中... {loadProgress}%
            </>
          ) : isRunning ? (
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
          disabled={isDisabled}
          className="px-4 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          重置
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          disabled={isDisabled}
          className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          复制
        </button>
        <div className="ml-auto text-gray-400 text-sm">
          Python 3
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[python()]}
          theme={oneDark}
          onChange={(value) => setCode(value)}
          className="text-sm"
        />
      </div>
    </div>
  );
};
