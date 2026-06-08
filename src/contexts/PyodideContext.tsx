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

// 语法错误检查 - 只检查明显的语法错误
const checkSyntaxErrors = (code: string): string[] => {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const lineNumber = i + 1;
    
    // 跳过注释、空行和导入
    if (trimmedLine.startsWith('#') || trimmedLine === '') {
      continue;
    }
    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      continue;
    }
    
    // 检查 if/for/while/def/class 后缺少冒号
    if (/^(if|for|while|def|class)\s+.+[^:\s]$/.test(trimmedLine)) {
      // 但排除 elif 和 else（它们单独一行时不需要检查冒号）
      if (!trimmedLine.startsWith('elif') && !trimmedLine.startsWith('else') && !trimmedLine.startsWith('except')) {
        errors.push(`第 ${lineNumber} 行: ${trimmedLine.split(' ')[0]} 语句后缺少冒号 ':'`);
      }
    }
    
    // 只在单引号明显不匹配时报错（简化检查）
    // 跳过 f-string 内的引号
    if (trimmedLine.includes('f"') || trimmedLine.includes("f'")) {
      continue;
    }
    
    // 检查括号匹配
    const openParens = (trimmedLine.match(/\(/g) || []).length;
    const closeParens = (trimmedLine.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`第 ${lineNumber} 行: 括号不匹配 (${openParens}个开, ${closeParens}个闭)`);
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
          // f-string - 提取引号内容
          content = content.replace(/^f["']|["']$/g, '');
          // 替换变量为模拟值
          content = content.replace(/\{[^}]+\}/g, '[值]');
        } else {
          // 普通字符串
          content = content.replace(/^["']|["']$/g, '');
        }
        outputs.push(content);
      }
      continue;
    }

    // 模拟 df.info()
    if (trimmedLine === 'df.info()' || trimmedLine.endsWith('.info()')) {
      outputs.push('RangeIndex: 1000 entries\nData columns: 7 columns');
      continue;
    }

    // 模拟 df.describe()
    if (trimmedLine === 'df.describe()' || trimmedLine.endsWith('.describe()')) {
      outputs.push('         quantity    price\nmean      5.45      27.50');
      continue;
    }

    // 模拟 df.head()
    if (trimmedLine === 'df.head()' || trimmedLine.endsWith('.head()')) {
      outputs.push('0  ORD-001  牛奶   3  12.5');
      outputs.push('1  ORD-002  面包   2   8.0');
      continue;
    }

    // 模拟 df.dtypes
    if (trimmedLine === 'df.dtypes' || trimmedLine.endsWith('.dtypes')) {
      outputs.push('order_id              object\nquantity             int64\ndtype: object');
      continue;
    }

    // 模拟 isnull().sum()
    if (trimmedLine.includes('isnull().sum()')) {
      outputs.push('customer_id    50\norder_id       0\ndtype: int64');
      continue;
    }

    // 模拟 drop_duplicates
    if (trimmedLine.includes('drop_duplicates')) {
      dataState.rowCount -= dataState.nullCount;
      outputs.push(`去重后: ${dataState.rowCount} 行`);
      continue;
    }

    // 模拟 fillna
    if (trimmedLine.includes('fillna')) {
      outputs.push('缺失值已填充');
      continue;
    }

    // 模拟 to_datetime
    if (trimmedLine.includes('to_datetime')) {
      outputs.push('日期类型转换完成');
      continue;
    }

    // 模拟 .abs()
    if (trimmedLine.includes('.abs()')) {
      outputs.push('负数已转为正数');
      continue;
    }

    // 模拟 plt.show()
    if (trimmedLine.includes('plt.show()')) {
      outputs.push('图表已生成');
      continue;
    }

    // 模拟 KMeans
    if (trimmedLine.includes('KMeans') || trimmedLine.includes('kmeans')) {
      outputs.push('K-Means 聚类完成');
      continue;
    }

    // 模拟 apriori
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
      // 只检查最明显的语法错误
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
