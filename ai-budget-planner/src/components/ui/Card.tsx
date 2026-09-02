import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, glass, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-slate-700/50 bg-slate-800/50 p-6',
      glass && 'backdrop-blur-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between mb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-sm font-medium text-slate-400 uppercase tracking-wide', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
