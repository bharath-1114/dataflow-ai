import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo = ({ className, iconOnly = false }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-20 blur-md" />
        
        {/* Icon container */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg">
          {/* Abstract data/AI symbol */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-primary-foreground"
            strokeWidth="2"
            stroke="currentColor"
          >
            {/* Neural network / data nodes */}
            <circle cx="12" cy="6" r="2" fill="currentColor" />
            <circle cx="6" cy="18" r="2" fill="currentColor" />
            <circle cx="18" cy="18" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.7" />
            
            {/* Connecting lines */}
            <path d="M12 8v2" strokeLinecap="round" />
            <path d="M10.5 13.5L7.5 16.5" strokeLinecap="round" />
            <path d="M13.5 13.5L16.5 16.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
            DataViz
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            AI Analytics
          </span>
        </div>
      )}
    </div>
  );
};
