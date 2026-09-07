import React from 'react';

export interface LogoMarkProps {
  className?: string;
  size?: number;
  variant?: 'brand' | 'monochrome';
}

export function LogoMark({ className = "w-6 h-6", size, variant = 'brand' }: LogoMarkProps) {
  const style = size ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Foundational Pillar (Control & Financial Structure) */}
      <path
        d="M 5.5,5.5 C 5.5,4.672 6.172,4 7,4 H 12 C 12.828,4 13.5,4.672 13.5,5.5 V 26.5 C 13.5,27.328 12.828,28 12,28 H 7 C 6.172,28 5.5,27.328 5.5,26.5 Z"
        fill={variant === 'brand' ? '#2f4157' : 'currentColor'}
      />
      {/* Upper Facet (Focus & Ascending Momentum) */}
      <path
        d="M 16.5,4 H 22.5 C 25.261,4 27.5,6.239 27.5,9 C 27.5,11.761 25.261,14 22.5,14 H 16.5 V 4 Z"
        fill={variant === 'brand' ? '#567c8e' : 'currentColor'}
        fillOpacity={variant === 'monochrome' ? '0.85' : undefined}
      />
      {/* Lower Facet (Growth & Wealth Accumulation) */}
      <path
        d="M 16.5,17.5 H 24.5 C 27.261,17.5 29.5,19.739 29.5,22.5 C 29.5,25.261 27.261,27.5 24.5,27.5 H 16.5 V 17.5 Z"
        fill={variant === 'brand' ? '#a2c1d1' : 'currentColor'}
        fillOpacity={variant === 'monochrome' ? '0.65' : undefined}
      />
    </svg>
  );
}

export interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  showBadge?: boolean;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'monochrome';
}

export function Logo({
  className = "",
  iconOnly = false,
  showBadge = false,
  subtitle,
  size = 'md',
  variant = 'brand',
}: LogoProps) {
  const sizeMap = {
    sm: {
      container: "h-8 w-8 rounded-lg",
      iconSize: 18,
      text: "text-base",
      subtext: "text-[10px]",
    },
    md: {
      container: "h-10 w-10 rounded-xl",
      iconSize: 22,
      text: "text-xl",
      subtext: "text-xs",
    },
    lg: {
      container: "h-14 w-14 rounded-2xl",
      iconSize: 30,
      text: "text-2xl",
      subtext: "text-sm",
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Geometric Symbol Container */}
      <div
        className={`${currentSize.container} bg-[#2f4157] border border-[#567c8e] flex items-center justify-center shadow-md shadow-[#2f4157]/15 group-hover:bg-[#567c8e] transition-all duration-300 shrink-0`}
      >
        <LogoMark size={currentSize.iconSize} variant={variant} />
      </div>

      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`${currentSize.text} font-bold tracking-tight text-[#2f4157] group-hover:text-[#567c8e] transition-colors font-sans`}>
              BudgetAI
            </span>
            {showBadge && (
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#e3ecf2] border border-[#a2c1d1] text-[#2f4157]">
                PRO
              </span>
            )}
          </div>
          {subtitle && (
            <p className={`${currentSize.subtext} text-[#567c8e] font-medium`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

