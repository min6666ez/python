import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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

// 语法错误检查
const checkSyntaxErrors = (code: string): string[] => {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const lineNumber = i + 1;
    
    // 跳过注释、空行和导入
    if (trimmedLine.startsWith('#') || trimmedLine === '' || trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      continue;
    }
    
    // 检查 if/for/while/def/class 后缺少冒号
    if (/^(if|for|while|def|class|elif|else|except)\s+.+[^:\s]$/.test(trimmedLine)) {
      errors.push(`第 ${lineNumber} 行: ${trimmedLine.split(' ')[0]} 语句后缺少冒号 ':'`);
    }
    
    // 检查字符串引号是否闭合
    const singleQuotes = (line.match(/'/g) || []).length - (line.match(/^[^']*'/g) || []).length;
    const doubleQuotes = (line.match(/"/g) || []).length;
    
    // 简化检查：跳过 f-string
    if (!trimmedLine.includes('f"') && !trimmedLine.includes("f'")) {
      if ((singleQuotes % 2 !== 0) && !trimmedLine.includes("print")) {
        errors.push(`第 ${lineNumber} 行: 单引号未闭合`);
      }
    }
    
    // 检查括号匹配
    const openParens = (trimmedLine.match(/\(/g) || []).length;
    const closeParens = (trimmedLine.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`第 ${lineNumber} 行: 括号不匹配 (${openParens}个开, ${closeParens}个闭)`);
    }
    
    // 检查中括号匹配
    const openBrackets = (trimmedLine.match(/\[/g) || []).length;
    const closeBrackets = (trimmedLine.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push(`第 ${lineNumber} 行: 中括号不匹配`);
    }
    
    // 检查常见拼写错误
    const misspellings: { [key: string]: string } = {
      'prnt': 'print', 'printt': 'print',
      'forr': 'for', 'whlie': 'while',
      'retun': 'return', 'defi': 'def',
      'classs': 'class', 'tru': 'True'
    };
    
    for (const [wrong, correct] of Object.entries(misspellings)) {
      if (trimmedLine.includes(wrong)) {
        errors.push(`第 ${lineNumber} 行: 疑似拼写错误 '${wrong}'，是否为 '${correct}'？`);
      }
    }
  }
  
  return errors;
};

// 模拟Python执行器
const executePythonMock = (code: string): ExecutionResult => {
  const outputs: string[] = [];
  const lines = code.split('\n');
  
  // 模拟数据状态
  let dataState = { rowCount: 1000, nullCount: 50 };

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 跳过注释、空行和导入
    if (trimmedLine.startsWith('#') || trimmedLine === '' || trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      continue;
    }

    // 处理 print 语句
    if (trimmedLine.startsWith('print(')) {
      const match = trimmedLine.match(/print\((.*)\)\s*$/);
      if (match) {
        let content = match[1].trim();
        if (content.startsWith('f"') || content.startsWith("f'")) {
          content = content.replace(/^f["']|["']$/g, '').replace(/\{[^}]+\}/g, '[值]');
        } else {
          content = content.replace(/^["']|["']$/g, '');
        }
        outputs.push(content);
      }
      continue;
    }

    // 模拟各种操作
    if (trimmedLine.includes('df.info()')) {
      outputs.push('RangeIndex: 1000 entries\nData columns: 7\n...');
      continue;
    }
    if (trimmedLine.includes('df.describe()')) {
      outputs.push('         quantity    price\nmean      5.45      27.50');
      continue;
    }
    if (trimmedLine.includes('df.head()')) {
      outputs.push('0  ORD-001  牛奶   3  12.5');
      continue;
    }
    if (trimmedLine.includes('drop_duplicates')) {
      dataState.rowCount -= 50;
      outputs.push(`去重后: ${dataState.rowCount} 行`);
      continue;
    }
    if (trimmedLine.includes('fillna')) {
      outputs.push('缺失值已填充');
      continue;
    }
    if (trimmedLine.includes('plt.show()')) {
      outputs.push('图表已生成');
      continue;
    }
    if (trimmedLine.includes('KMeans') || trimmedLine.includes('kmeans')) {
      outputs.push('K-Means 聚类完成');
      continue;
    }
    if (trimmedLine.includes('apriori')) {
      outputs.push('Apriori 算法完成');
      continue;
    }
  }

  if (outputs.length === 0) {
    outputs.push('代码执行完成（无输出）');
  }

  return { stdout: outputs.join('\n'), stderr: '', result: null, error: false, images: [] };
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
    try {
      // 先检查语法错误
      const syntaxErrors = checkSyntaxErrors(code);
      if (syntaxErrors.length > 0) {
        return {
          stdout: '',
          stderr: '语法错误:\n' + syntaxErrors.join('\n'),
          result: null,
          error: true,
          images: []
        };
      }
      
      return executePythonMock(code);
    } catch (error) {
      return {
        stdout: '',
        stderr: `执行出错: ${error}`,
        result: null,
        error: true,
        images: []
      };
    }
  };

  const reset = async (): Promise<void> => {};
  const loadPackage = async (packages: string[]): Promise<void> => {};

  return (
    <PyodideContext.Provider value={{ pyodide, isLoading, loadProgress, loadError, runPython, reset, loadPackage }}>
      {children}
    </PyodideContext.Provider>
  );
};

export const usePyodide = () => {
  const context = useContext(PyodideContext);
  if (context === undefined) {
    throw new Error('usePyodide must be used within a PyodideProvider');
  }
  return context;
};
