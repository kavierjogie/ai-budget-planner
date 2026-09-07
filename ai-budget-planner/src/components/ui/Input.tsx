import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#2f4157]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#2f4157]',
            'placeholder:text-[#567c8e] transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#567c8e] focus:border-transparent',
            error
              ? 'border-red-500/50 focus:ring-red-500'
              : 'border-[#a2c1d1] hover:border-[#567c8e]',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[#567c8e]">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
