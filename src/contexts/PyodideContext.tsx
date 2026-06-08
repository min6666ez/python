import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 类型定义
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
  runPython: (code: string) => Promise<ExecutionResult>;
  reset: () => Promise<void>;
}

// 创建上下文
const PyodideContext = createContext<PyodideContextType | undefined>(undefined);

// 加载状态组件
const PyodideLoading: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="text-center p-8 rounded-lg shadow-lg max-w-md">
        <div className="text-2xl font-bold text-primary mb-4">加载 Python 环境</div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-secondary h-4 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-600">
          {progress < 30 ? '下载 Pyodide 核心...' : 
           progress < 60 ? '加载基础库...' : 
           progress < 80 ? '安装数据分析包...' : 
           progress < 95 ? '配置运行环境...' : '准备完成！'}
        </p>
      </div>
    </div>
  );
};

// 提供者组件
export const PyodideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        setLoadProgress(10);
        // 动态导入 Pyodide
        const { loadPyodide } = await import('pyodide');
        setLoadProgress(30);

        const indexURL = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/";
        const pyodideInstance = await loadPyodide({ 
          indexURL
        });
        setLoadProgress(60);

        // 加载必要的包
        await pyodideInstance.loadPackage(['pandas', 'matplotlib', 'scikit-learn']);
        setLoadProgress(80);

        // 安装 mlxtend
        await pyodideInstance.runPythonAsync(`
          import micropip
          await micropip.install('mlxtend')
        `);
        setLoadProgress(95);

        // 配置 matplotlib 以生成可显示的图表
        await pyodideInstance.runPythonAsync(`
          import matplotlib
          matplotlib.use('Agg')
          import matplotlib.pyplot as plt
          import base64
          import io
          import sys

          # 存储生成的图表
          _generated_images = []

          def plot_to_base64():
              buf = io.BytesIO()
              plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
              buf.seek(0)
              img_str = base64.b64encode(buf.read()).decode('utf-8')
              plt.close()
              return img_str

          def capture_plot():
              img_str = plot_to_base64()
              _generated_images.append(img_str)

          # 将函数添加到全局命名空间
          sys.modules['__main__'].plot_to_base64 = plot_to_base64
          sys.modules['__main__'].capture_plot = capture_plot
          sys.modules['__main__']._generated_images = _generated_images
        `);

        setLoadProgress(100);
        setPyodide(pyodideInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        setIsLoading(false);
      }
    };

    loadPyodide();

    // 清理函数
    return () => {
      if (pyodide) {
        pyodide.destroy();
      }
    };
  }, []);

  // 运行 Python 代码
  const runPython = async (code: string): Promise<ExecutionResult> => {
    if (!pyodide) {
      return {
        stdout: '',
        stderr: 'Pyodide is not loaded yet',
        result: null,
        error: true,
        images: []
      };
    }

    // 捕获标准输出
    let stdout = '';
    let stderr = '';

    try {
      // 重定向 stdout 和 stderr
      pyodide.setStdout({ write: (text: string) => { stdout += text; } });
      pyodide.setStderr({ write: (text: string) => { stderr += text; } });

      // 清空之前的图片
      await pyodide.runPythonAsync(`
        _generated_images.clear()
      `);

      // 包装用户代码，自动捕获 plt.show()
      const wrappedCode = `
import matplotlib.pyplot as plt
_original_show = plt.show

def _capturing_show(*args, **kwargs):
    capture_plot()
    plt.close('all')

plt.show = _capturing_show

${code}

# 最后检查是否有未显示的图表
if len(plt.get_fignums()) > 0:
    capture_plot()
    plt.close('all')
`;

      // 运行代码
      const result = await pyodide.runPythonAsync(wrappedCode);

      // 获取生成的图片
      const images = pyodide.globals.get('_generated_images').toJs();

      return {
        stdout,
        stderr,
        result,
        error: false,
        images: Array.from(images)
      };
    } catch (error: any) {
      return {
        stdout,
        stderr: error.toString(),
        result: null,
        error: true,
        images: []
      };
    }
  };

  // 重置 Pyodide 状态
  const reset = async (): Promise<void> => {
    if (pyodide) {
      try {
        await pyodide.runPythonAsync(`
          import gc
          gc.collect()
          # 重置全局变量
          import sys
          # 保留必要的函数
          keep_vars = {'plot_to_base64', 'capture_plot', '_generated_images'}
          for key in list(sys.modules['__main__'].__dict__.keys()):
              if not key.startswith('_') or key in keep_vars:
                  continue
              del sys.modules['__main__'].__dict__[key]
          # 清空图片
          _generated_images.clear()
          import matplotlib.pyplot as plt
          plt.close('all')
        `);
      } catch (error) {
        console.error('Failed to reset Pyodide:', error);
      }
    }
  };

  const value = {
    pyodide,
    isLoading,
    loadProgress,
    runPython,
    reset
  };

  return (
    <PyodideContext.Provider value={value}>
      {isLoading && <PyodideLoading progress={loadProgress} />}
      {children}
    </PyodideContext.Provider>
  );
};

// 自定义 Hook
export const usePyodide = (): PyodideContextType => {
  const context = useContext(PyodideContext);
  if (context === undefined) {
    throw new Error('usePyodide must be used within a PyodideProvider');
  }
  return context;
};
