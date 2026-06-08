import React, { useState, useEffect } from 'react';

interface LazyLoaderProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  delay?: number;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  placeholder = (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ),
  delay = 100 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isLoaded) {
    return <div className="w-full">{placeholder}</div>;
  }

  return <React.Suspense fallback={placeholder}>{children}</React.Suspense>;
};
