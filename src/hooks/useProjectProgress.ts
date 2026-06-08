import { useState, useEffect, useCallback } from 'react';

interface TaskProgress {
  taskId: string;
  completed: boolean;
  completedAt?: number;
}

interface ProjectProgress {
  projectId: string;
  tasks: TaskProgress[];
  completedAt?: number;
  lastAccessedAt: number;
}

const STORAGE_KEY = 'data_analysis_project_progress';

export const useProjectProgress = (projectId: string) => {
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载进度
  const loadProgress = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allProgress = JSON.parse(stored);
        const projectProgress = allProgress[projectId];
        setProgress(projectProgress || null);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    setIsLoaded(true);
  }, [projectId]);

  // 保存进度到 localStorage
  const saveProgress = useCallback((newProgress: ProjectProgress) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allProgress = stored ? JSON.parse(stored) : {};
      allProgress[projectId] = newProgress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [projectId]);

  // 标记任务完成
  const completeTask = useCallback((taskId: string) => {
    const now = Date.now();
    let newProgress: ProjectProgress;

    if (progress) {
      const existingTask = progress.tasks.find(t => t.taskId === taskId);
      if (existingTask && existingTask.completed) {
        return; // 已经完成
      }

      newProgress = {
        ...progress,
        lastAccessedAt: now,
        tasks: progress.tasks.map(t => 
          t.taskId === taskId 
            ? { ...t, completed: true, completedAt: now }
            : t
        )
      };
    } else {
      newProgress = {
        projectId,
        tasks: [{ taskId, completed: true, completedAt: now }],
        lastAccessedAt: now
      };
    }

    saveProgress(newProgress);
  }, [progress, projectId, saveProgress]);

  // 检查任务是否完成
  const isTaskCompleted = useCallback((taskId: string): boolean => {
    if (!progress) return false;
    return progress.tasks.some(t => t.taskId === taskId && t.completed);
  }, [progress]);

  // 获取完成的任务数
  const getCompletedTasksCount = useCallback((): number => {
    if (!progress) return 0;
    return progress.tasks.filter(t => t.completed).length;
  }, [progress]);

  // 重置项目进度
  const resetProgress = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allProgress = JSON.parse(stored);
        delete allProgress[projectId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
      }
      setProgress(null);
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  }, [projectId]);

  // 初始化加载
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 更新最后访问时间
  useEffect(() => {
    if (isLoaded && progress) {
      const now = Date.now();
      if (now - progress.lastAccessedAt > 60000) { // 超过1分钟才更新
        saveProgress({
          ...progress,
          lastAccessedAt: now
        });
      }
    }
  }, [isLoaded, progress, saveProgress]);

  return {
    progress,
    isLoaded,
    completeTask,
    isTaskCompleted,
    getCompletedTasksCount,
    resetProgress
  };
};

// 获取所有项目的进度
export const useAllProjectsProgress = () => {
  const [allProgress, setAllProgress] = useState<Record<string, ProjectProgress>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAllProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load all progress:', error);
    }
  }, []);

  return allProgress;
};
