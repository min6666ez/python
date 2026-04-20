import React, { useState } from 'react';
import { usePyodide } from '../contexts/PyodideContext';

interface PythonEditorProps {
  initialCode: string;
  onRun: (result: any) => void;
}

export const PythonEditor: React.FC<PythonEditorProps> = ({ initialCode, onRun }) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const { runPython } = usePyodide();

  const handleRun = async () => {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 bg-gray-800">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isRunning ? '运行中...' : '运行'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          重置
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          复制
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none"
        spellCheck={false}
      />
    </div>
  );
};
