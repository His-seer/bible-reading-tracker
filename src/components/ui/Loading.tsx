import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse';
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  message,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinnerContent = (
    <svg
      className={`${sizeStyles[size]} animate-spin text-indigo-600`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const pulseContent = (
    <div
      className={`${sizeStyles[size]} bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse`}
    />
  );

  const content = variant === 'spinner' ? spinnerContent : pulseContent;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          {content}
          {message && <p className="text-neutral-600 font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {content}
      {message && <p className="text-neutral-600 text-sm font-medium">{message}</p>}
    </div>
  );
};

export default Loading;
