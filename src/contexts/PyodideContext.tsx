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

// 模拟Python执行器 - 根据用户代码生成合理输出
const executePythonMock = (code: string): ExecutionResult => {
  const outputs: string[] = [];
  const errors: string[] = [];
  
  const lines = code.split('\n');
  let inMultiLineString = false;
  let stringChar = '';
  
  // 模拟数据状态
  let dataState = {
    rowCount: 1000,
    nullCount: 50,
    duplicateCount: 50,
    negativeCount: 30
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // 处理多行字符串
    if (!inMultiLineString && (trimmedLine.startsWith('"""') || trimmedLine.startsWith("'''"))) {
      stringChar = trimmedLine.substring(0, 3);
      if ((trimmedLine.match(/"""/g) || []).length === 1) {
        inMultiLineString = true;
      }
      continue;
    }
    if (inMultiLineString) {
      if (trimmedLine.includes(stringChar)) {
        inMultiLineString = false;
      }
      continue;
    }
    
    // 跳过注释和空行
    if (trimmedLine.startsWith('#') || trimmedLine === '') {
      continue;
    }
    
    // 跳过导入语句
    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      continue;
    }

    // 处理 print 语句
    if (trimmedLine.startsWith('print(')) {
      const match = trimmedLine.match(/print\((.*)\)\s*$/);
      if (match) {
        let content = match[1].trim();
        
        // 处理 f-string
        if (content.startsWith('f"') || content.startsWith("f'")) {
          // 模拟 f-string 结果
          content = content.replace(/^f["']|["']$/g, '');
          // 替换变量引用为模拟值
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
    if (trimmedLine.includes('df.info()') || trimmedLine === 'df.info()') {
      outputs.push('RangeIndex: 1000 entries, 0 to 999');
      outputs.push('Data columns (total 7 columns):');
      outputs.push(' #   Column        Non-Null Count  Dtype');
      outputs.push('---  ------        --------------  -----');
      outputs.push(' 0   order_id      1000 non-null   object');
      outputs.push(' 1   customer_id   950 non-null    object');
      outputs.push(' 2   product_name  1000 non-null   object');
      outputs.push(' 3   quantity      1000 non-null   int64');
      outputs.push('dtypes: datetime64[ns](1), float64(2), int64(1), object(3)');
      continue;
    }

    // 模拟 df.describe()
    if (trimmedLine.includes('df.describe()')) {
      outputs.push('         quantity    unit_price  total_amount');
      outputs.push('count  1000.000000  1000.000000   1000.000000');
      outputs.push('mean      5.450000    27.500000    149.975000');
      outputs.push('std       2.872281    12.987008    125.340000');
      outputs.push('min       1.000000     5.000000      5.000000');
      outputs.push('max      10.000000    50.000000    500.000000');
      continue;
    }

    // 模拟 df.head()
    if (trimmedLine.includes('df.head()')) {
      outputs.push('  order_id customer_id product_name  quantity  unit_price');
      outputs.push('0  ORD-0001     CUST-001         牛奶         3        12.5');
      outputs.push('1  ORD-0002     CUST-002         面包         2         8.0');
      outputs.push('2  ORD-0003     CUST-003         鸡蛋         1        15.0');
      continue;
    }

    // 模拟 df.dtypes
    if (trimmedLine.includes('df.dtypes')) {
      outputs.push('order_id              object');
      outputs.push('customer_id         object');
      outputs.push('quantity             int64');
      outputs.push('dtype: object');
      continue;
    }

    // 模拟 df.isnull().sum()
    if (trimmedLine.includes('isnull().sum()')) {
      outputs.push('order_id        0');
      outputs.push('customer_id    50');
      outputs.push('product_name    0');
      outputs.push('quantity        0');
      continue;
    }

    // 模拟 df.drop_duplicates()
    if (trimmedLine.includes('drop_duplicates')) {
      dataState.rowCount -= dataState.duplicateCount;
      outputs.push(`去重后数据形状: (${dataState.rowCount}, 7)`);
      continue;
    }

    // 模拟 df.fillna
    if (trimmedLine.includes('fillna')) {
      dataState.nullCount = 0;
      outputs.push('缺失值已填充');
      continue;
    }

    // 模拟 df.abs()
    if (trimmedLine.includes('.abs()')) {
      dataState.negativeCount = 0;
      outputs.push('负数已转为正数');
      continue;
    }

    // 模拟 plt.show()
    if (trimmedLine.includes('plt.show()')) {
      outputs.push('图表已生成');
      continue;
    }

    // 模拟 plt.figure
    if (trimmedLine.includes('plt.figure')) {
      outputs.push('图表已开始绘制');
      continue;
    }

    // 模拟 plt.plot
    if (trimmedLine.includes('plt.plot')) {
      outputs.push('数据已绑定到图表');
      continue;
    }

    // 模拟 plt.bar
    if (trimmedLine.includes('plt.bar')) {
      outputs.push('柱状图数据已绑定');
      continue;
    }

    // 模拟 plt.title
    if (trimmedLine.includes('plt.title')) {
      // 提取标题内容
      const titleMatch = trimmedLine.match(/plt\.title\(["'](.+?)["']\)/);
      if (titleMatch) {
        outputs.push(`图表标题: ${titleMatch[1]}`);
      }
      continue;
    }

    // 模拟 pd.to_datetime
    if (trimmedLine.includes('to_datetime')) {
      outputs.push('日期类型转换完成');
      continue;
    }

    // 模拟 quantile
    if (trimmedLine.includes('quantile')) {
      outputs.push('分位数计算完成');
      continue;
    }

    // 模拟 groupby
    if (trimmedLine.includes('groupby')) {
      outputs.push('分组完成');
      continue;
    }

    // 模拟 merge
    if (trimmedLine.includes('merge')) {
      outputs.push('数据合并完成');
      continue;
    }

    // 模拟 KMeans
    if (trimmedLine.includes('KMeans') || trimmedLine.includes('kmeans')) {
      outputs.push('K-Means 聚类完成');
      outputs.push('聚类数量: 4');
      continue;
    }

    // 模拟 DBSCAN
    if (trimmedLine.includes('DBSCAN') || trimmedLine.includes('dbscan')) {
      outputs.push('DBSCAN 聚类完成');
      outputs.push('发现 23 个异常点');
      continue;
    }

    // 模拟 apriori
    if (trimmedLine.includes('apriori')) {
      outputs.push('Apriori 算法完成');
      outputs.push('找到 25 个频繁项集');
      continue;
    }

    // 模拟 fcluster
    if (trimmedLine.includes('fcluster')) {
      outputs.push('层次聚类完成');
      continue;
    }

    // 模拟 linkage
    if (trimmedLine.includes('linkage')) {
      outputs.push('距离矩阵计算完成');
      continue;
    }

    // 模拟 StandardScaler
    if (trimmedLine.includes('StandardScaler') || trimmedLine.includes('fit_transform')) {
      outputs.push('数据标准化完成');
      continue;
    }

    // 模拟 sort_values
    if (trimmedLine.includes('sort_values')) {
      outputs.push('数据排序完成');
      continue;
    }

    // 模拟 value_counts
    if (trimmedLine.includes('value_counts')) {
      outputs.push('值计数完成');
      continue;
    }
  }

  // 如果没有任何输出，提示用户
  if (outputs.length === 0) {
    outputs.push('代码执行完成（无输出）');
  }

  return {
    stdout: outputs.join('\n'),
    stderr: errors.length > 0 ? errors.join('\n') : '',
    result: null,
    error: errors.length > 0,
    images: []
  };
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
