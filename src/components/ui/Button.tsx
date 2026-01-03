import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      font-semibold rounded-base transition-all duration-base
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2
      inline-flex items-center justify-center gap-2
      ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantStyles = {
      primary: `
        bg-gradient-to-r from-primary-600 to-secondary-600
        text-white
        hover:from-primary-700 hover:to-secondary-600
        hover:scale-[1.01] active:scale-[0.98]
        focus:ring-primary-500/40
        shadow-md hover:shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30
      `,
      secondary: `
        bg-white text-primary-600
        border-2 border-primary-100
        hover:border-primary-600
        hover:bg-primary-50
        active:scale-[0.98]
        focus:ring-primary-500/40
        shadow-sm hover:shadow-md
      `,
      danger: `
        bg-error-600 text-white
        hover:bg-error-700
        active:scale-[0.98]
        focus:ring-error-500/40
        shadow-md hover:shadow-lg
      `,
      ghost: `
        bg-transparent text-neutral-600
        hover:bg-neutral-100 hover:text-primary-600
        focus:ring-neutral-200
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const buttonContent = (
      <>
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </>
    );

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
