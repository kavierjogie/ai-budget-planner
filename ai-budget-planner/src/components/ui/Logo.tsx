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
      src="/assets/budgetai-logo.png"
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
      imageWidth: 96,
      imageHeight: 96,
      subtext: "text-[10px]",
    },
    md: {
      imageWidth: 116,
      imageHeight: 116,
      subtext: "text-xs",
    },
    lg: {
      imageWidth: 148,
      imageHeight: 148,
      subtext: "text-sm",
    },
  };

  const currentSize = sizeMap[size];
  void iconOnly;
  void variant;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/assets/budgetai-logo.png"
        alt="BudgetAI"
        width={currentSize.imageWidth}
        height={currentSize.imageHeight}
        className="h-auto w-auto max-w-full object-contain"
        priority={size !== 'sm'}
      />

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

