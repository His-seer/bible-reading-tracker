import React from 'react';
import { X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', dismissible = true, onDismiss, title, children, className = '', ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    const variantStyles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        title: 'text-green-800',
        text: 'text-green-700',
        icon: 'text-green-500',
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        title: 'text-red-800',
        text: 'text-red-700',
        icon: 'text-red-500',
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        title: 'text-yellow-800',
        text: 'text-yellow-700',
        icon: 'text-yellow-500',
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        title: 'text-blue-800',
        text: 'text-blue-700',
        icon: 'text-blue-500',
      },
    };

    const styles = variantStyles[variant];

    const iconMap = {
      success: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    };

    return (
      <div
        ref={ref}
        className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded-lg flex gap-3 ${className}`}
        {...props}
      >
        <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>{iconMap[variant]}</div>
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${styles.title} mb-1`}>{title}</h3>}
          <div className={`text-sm ${styles.text}`}>{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-2 text-neutral-400 hover:text-neutral-600"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
