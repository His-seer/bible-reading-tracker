import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, isValid, icon, iconPosition = 'left', className = '', ...props }, ref) => {
    const hasIcon = icon !== undefined;
    const borderColor = error ? 'border-error-500' : isValid ? 'border-success-500' : 'border-neutral-300';
    const focusBorderColor = error ? 'focus:border-error-500' : 'focus:border-primary-500';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {hasIcon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 flex items-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 text-base font-medium
              border-2 rounded-xl transition-all duration-200
              placeholder:text-neutral-400 placeholder:font-normal
              bg-white focus:bg-white
              ${borderColor} ${focusBorderColor}
              focus:outline-none focus:ring-4 focus:ring-primary-500/10
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:border-neutral-200 disabled:text-neutral-400
              ${hasIcon && iconPosition === 'left' ? 'pl-11' : ''}
              ${hasIcon && iconPosition === 'right' ? 'pr-11' : ''}
              ${className}
            `}
            {...props}
          />

          {hasIcon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 flex items-center">
              {icon}
            </div>
          )}

          {isValid && !error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-success-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-sm text-neutral-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
