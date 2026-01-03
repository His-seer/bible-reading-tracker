import React from 'react';

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ label, error, hint, required, children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">{children}</div>

        <div className="mt-1.5 min-h-5">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
        </div>
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
