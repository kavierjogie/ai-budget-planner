import Image from 'next/image';

export interface LogoMarkProps {
  className?: string;
  size?: number;
  variant?: 'brand' | 'monochrome';
}

export function LogoMark({ className = "w-6 h-6", size, variant = 'brand' }: LogoMarkProps) {
  const style = size ? { width: `${size}px`, height: `${size}px` } : {};
  void variant;

  return (
    <Image
      src="/assets/budgetai-mark.png"
      alt=""
      width={size ?? 24}
      height={size ?? 24}
      className={className}
      style={style}
      aria-hidden="true"
    />
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
      imageWidth: 56,
      imageHeight: 69,
      markSize: 40,
      subtext: "text-[10px]",
    },
    md: {
      imageWidth: 68,
      imageHeight: 84,
      markSize: 48,
      subtext: "text-xs",
    },
    lg: {
      imageWidth: 84,
      imageHeight: 104,
      markSize: 64,
      subtext: "text-sm",
    },
  };

  const currentSize = sizeMap[size];
  void variant;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {iconOnly ? (
        <LogoMark size={currentSize.markSize} className="shrink-0 object-contain" />
      ) : (
        <Image
          src="/assets/budgetai-logo.png"
          alt="BudgetAI"
          width={currentSize.imageWidth}
          height={currentSize.imageHeight}
          className="h-auto w-auto max-w-full object-contain"
          priority={size !== 'sm'}
        />
      )}

      {(showBadge || subtitle) && (
        <div className="flex flex-col justify-center">
          {showBadge && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#e3ecf2] border border-[#a2c1d1] text-[#2f4157]">
              PRO
            </span>
          )}
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

