import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-[#2f4157] hover:bg-[#567c8e] text-white shadow-lg shadow-[#2f4157]/20',
      secondary: 'bg-[#c7d9e5] hover:bg-[#a2c1d1] text-[#2f4157]',
      danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
      ghost: 'hover:bg-[#e3ecf2] text-[#567c8e] hover:text-[#2f4157]',
      outline: 'border border-[#a2c1d1] hover:border-[#567c8e] text-[#2f4157] hover:text-[#2f4157] hover:bg-[#e3ecf2]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#567c8e] focus:ring-offset-2 focus:ring-offset-[#f3f6f9]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
