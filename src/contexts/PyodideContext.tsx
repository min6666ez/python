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

const PyodideLoading: React.FC<{ progress: number; error: string | null }> = ({ progress, error }) => {
  const getStatusText = () => {
    if (progress < 20) return '初始化环境...';
    if (progress < 40) return '加载 Pyodide 核心...';
    if (progress < 60) return '加载基础库...';
    if (progress < 80) return '安装数据分析包...';
    if (progress < 95) return '配置运行环境...';
    return '准备完成！';
  };

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/90 z-50 backdrop-blur-sm">
        <div className="text-center p-8 rounded-2xl shadow-xl max-w-md mx-4">
          <div className="text-2xl font-bold text-red-600 mb-4 flex items-center justify-center gap-3">
            <span>⚠️</span>
            <span>Python 环境加载失败</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            重试加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 z-50 backdrop-blur-sm">
      <div className="text-center p-8 rounded-2xl shadow-xl max-w-md mx-4">
        <div className="text-2xl font-bold text-indigo-600 mb-4 flex items-center justify-center gap-3">
          <span className="animate-pulse">🐍</span>
          <span>加载 Python 环境</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-600 text-sm">{getStatusText()}</p>
        <p className="text-gray-400 text-xs mt-2">({Math.round(progress)}%)</p>
      </div>
    </div>
  );
};

export const PyodideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const initializePyodide = useCallback(async () => {
    try {
      setLoadProgress(10);
      
      const { loadPyodide } = await import('pyodide');
      setLoadProgress(25);

      const pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/"
      });
      setLoadProgress(50);

      await pyodideInstance.loadPackage(['pandas', 'matplotlib', 'scikit-learn']);
      setLoadProgress(75);

      await pyodideInstance.runPythonAsync(`
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        import base64
        import io
        import sys

        _generated_images = []

        def plot_to_base64():
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
            buf.seek(0)
            img_str = base64.b64encode(buf.read()).decode('utf-8')
            plt.close('all')
            return img_str

        def capture_plot():
            img_str = plot_to_base64()
            _generated_images.append(img_str)

        sys.modules['__main__'].plot_to_base64 = plot_to_base64
        sys.modules['__main__'].capture_plot = capture_plot
        sys.modules['__main__']._generated_images = _generated_images
      `);
      setLoadProgress(100);

      setPyodide(pyodideInstance);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Failed to load Pyodide:', error);
      setLoadError(error.message || 'Pyodide 加载失败，请刷新页面重试');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializePyodide();

    return () => {
      if (pyodide) {
        try {
          pyodide.destroy();
        } catch (e) {
          console.error('Error destroying pyodide:', e);
        }
      }
    };
  }, [initializePyodide, pyodide]);

  const runPython = async (code: string): Promise<ExecutionResult> => {
    if (!pyodide) {
      return {
        stdout: '',
        stderr: 'Python 环境尚未加载完成，请等待加载完成后再试',
        result: null,
        error: true,
        images: []
      };
    }

    let stdout = '';
    let stderr = '';

    try {
      pyodide.setStdout({ write: (text: string) => { stdout += text; } });
      pyodide.setStderr({ write: (text: string) => { stderr += text; } });

      await pyodide.runPythonAsync('_generated_images.clear()');

      const wrappedCode = `
import matplotlib.pyplot as plt
_original_show = plt.show

def _capturing_show(*args, **kwargs):
    capture_plot()
    plt.close('all')

plt.show = _capturing_show

${code}

if len(plt.get_fignums()) > 0:
    capture_plot()
    plt.close('all')
`;

      const result = await pyodide.runPythonAsync(wrappedCode);
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

  const reset = async (): Promise<void> => {
    if (pyodide) {
      try {
        await pyodide.runPythonAsync(`
          import gc
          gc.collect()
          import sys
          keep_vars = {'plot_to_base64', 'capture_plot', '_generated_images'}
          for key in list(sys.modules['__main__'].__dict__.keys()):
              if key.startswith('_') and key not in keep_vars:
                  del sys.modules['__main__'].__dict__[key]
          _generated_images.clear()
          import matplotlib.pyplot as plt
          plt.close('all')
        `);
      } catch (error) {
        console.error('Failed to reset Pyodide:', error);
      }
    }
  };

  const loadPackage = async (packages: string[]): Promise<void> => {
    if (pyodide) {
      await pyodide.loadPackage(packages);
    }
  };

  const value = {
    pyodide,
    isLoading,
    loadProgress,
    loadError,
    runPython,
    reset,
    loadPackage
  };

  return (
    <PyodideContext.Provider value={value}>
      {isLoading && <PyodideLoading progress={loadProgress} error={loadError} />}
      {children}
    </PyodideContext.Provider>
  );
};

export const usePyodide = (): PyodideContextType => {
  const context = useContext(PyodideContext);
  if (context === undefined) {
    throw new Error('usePyodide must be used within a PyodideProvider');
  }
  return context;
};
