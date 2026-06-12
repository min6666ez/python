import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏骨架 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* 主内容骨架 */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* 标题骨架 */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* 课程卡片骨架 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LessonSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏骨架 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* 内容骨架 */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 面包屑骨架 */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* 课程内容骨架 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6 mb-6" />

          {/* 代码编辑器骨架 */}
          <Skeleton className="h-80 w-full rounded-md" />

          {/* 按钮骨架 */}
          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

interface LoadingOverlayProps {
  text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = '加载中...' }) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};
