import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ExecutionResult {
  stdout: string;
  stderr: string;
  result: any;
  error: boolean;
  images: string[];
}

interface PyodideContextType {
  pyodide: any;
  isLoading: boolean;
  loadProgress: number;
  loadError: string | null;
  runPython: (code: string) => Promise<ExecutionResult>;
  reset: () => Promise<void>;
  loadPackage: (packages: string[]) => Promise<void>;
}

const PyodideContext = createContext<PyodideContextType | undefined>(undefined);

// 简单的语法检查
const checkSyntax = (code: string): string | null => {
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;
    
    if (line.startsWith('#') || line === '') continue;
    if (line.startsWith('import ') || line.startsWith('from ')) continue;
    
    // 检查缺少冒号
    if (/^(if|for|while|def|class)\s+.+[^:\s]$/.test(line)) {
      return `第 ${lineNum} 行: ${line.split(' ')[0]} 后缺少冒号 ':'`;
    }
    
    // 检查括号匹配
    const opens = (line.match(/\(/g) || []).length;
    const closes = (line.match(/\)/g) || []).length;
    if (opens !== closes) {
      return `第 ${lineNum} 行: 括号不匹配`;
    }
  }
  
  return null;
};

export const PyodideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(100);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
    setLoadProgress(100);
    setPyodide({ loaded: true });
  }, []);

  const runPython = async (code: string): Promise<ExecutionResult> => {
    // 先做语法检查
    const syntaxError = checkSyntax(code);
    if (syntaxError) {
      return {
        stdout: '',
        stderr: syntaxError,
        result: null,
        error: true,
        images: []
      };
    }

    // 返回成功消息（实际执行需要在真实Python环境）
    return {
      stdout: '✓ 代码语法检查通过\n\n提示: 这是一个模拟环境，实际代码执行需要在安装了Python的服务器上进行。',
      stderr: '',
      result: null,
      error: false,
      images: []
    };
  };

  const reset = async () => {};
  const loadPackage = async () => {};

  return (
    <PyodideContext.Provider value={{ pyodide, isLoading, loadProgress, loadError, runPython, reset, loadPackage }}>
      {children}
    </PyodideContext.Provider>
  );
};

export const usePyodide = () => {
  const context = useContext(PyodideContext);
  if (!context) {
    throw new Error('usePyodide must be used within a PyodideProvider');
  }
  return context;
};
